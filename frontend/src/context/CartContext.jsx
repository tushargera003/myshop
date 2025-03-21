import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUser from "../hooks/useUser";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser(); // Listen for changes in user

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        // If not logged in, load cart from local storage
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(localCart);
        setLoading(false);
        return;
      }
      // If logged in, fetch cart from backend
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(data.items)) {
        setCartItems(data.items);
        localStorage.removeItem("cartItems");
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch the cart whenever the user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(localCart);
      setLoading(false);
    }
  }, [user]);

  // Add to cart function (unchanged)
  const addToCart = async (productId, qty) => {
    try {
      const token = getToken();
      let productName = "";

      const productResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${productId}`
      );
      productName = productResponse.data.name;

      if (!token) {
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

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      toast.success(`${productName} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart!");
    }
  };

  // updateQty, removeFromCart, clearCart functions remain unchanged

  const updateQty = async (productId, qty) => {
    try {
      const token = getToken();
      if (!token) {
        const updatedCart = cartItems.map((item) =>
          item.product._id === productId ? { ...item, qty } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success("Quantity updated in cart!");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      toast.success("Quantity updated in cart!");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity in cart!");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = getToken();
      if (!token) {
        const updatedCart = cartItems.filter(
          (item) => item.product._id !== productId
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success("Item removed from cart!");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove item from cart!");
    }
  };

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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
