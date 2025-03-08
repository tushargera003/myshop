import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  // Function to get token
  const getToken = () => localStorage.getItem("token");

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        // If not logged in, use local storage
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(localCart);
        return;
      }

      // Fetch cart from backend if logged in
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(data.items)) {
        setCartItems(data.items);
        localStorage.removeItem("cartItems"); // Remove old local cart
      } else {
        setCartItems([]); // If invalid response, set empty cart
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        navigate("/auth");
      }
    }
  };

  // Add item to cart
  const addToCart = async (productId, qty) => {
    try {
      const token = getToken();
      let productName = "";

      // Fetch product details to get the name
      const productResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${productId}`
      );
      productName = productResponse.data.name; // Get product name

      if (!token) {
        // If not logged in, add to local storage
        const existingItemIndex = cartItems.findIndex(
          (item) => item.product._id === productId
        );

        let updatedCart;
        if (existingItemIndex >= 0) {
          updatedCart = [...cartItems];
          updatedCart[existingItemIndex].qty += qty;
        } else {
          updatedCart = [...cartItems, { product: productResponse.data, qty }];
        }

        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success(`${productName} added to cart!`, {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }

      // If logged in, add to backend cart
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart(); // Refresh cart items
      toast.success(`${productName} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart!"); // Show error toast
    }
  };

  // Update quantity
  const updateQty = async (productId, qty) => {
    try {
      const token = getToken();
      if (!token) {
        const updatedCart = cartItems.map((item) =>
          item.product._id === productId ? { ...item, qty } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success("Quantity updated in cart!"); // Show toast
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
      toast.success("Quantity updated in cart!"); // Show toast
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity in cart!"); // Show error toast
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const token = getToken();
      if (!token) {
        const updatedCart = cartItems.filter(
          (item) => item.product._id !== productId
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success("Item removed from cart!"); // Show toast
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
      toast.success("Item removed from cart!"); // Show toast
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove item from cart!"); // Show error toast
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCartItems([]);
        localStorage.removeItem("cartItems");

        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems([]);
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Sync local cart with backend
  const syncCart = async () => {
    const token = getToken();
    if (token) {
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (localCart.length > 0) {
        for (const item of localCart) {
          const existingItem = cartItems.find(
            (cartItem) => cartItem.product._id === item.product._id
          );

          if (existingItem) {
            await updateQty(item.product._id, existingItem.qty + item.qty);
          } else {
            await addToCart(item.product._id, item.qty);
          }
        }
        localStorage.removeItem("cartItems");
      }
    }
  };

  // Fetch cart on component mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCart(); // Fetch backend cart when logged in
    } else {
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(localCart); // Load from local storage if not logged in
    }
  }, []); // Run only on mount

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
