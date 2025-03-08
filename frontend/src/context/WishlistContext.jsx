import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist items for the logged-in user
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    // If no token, clear the wishlist and return
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlistItems(data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);

      // If the error is due to an invalid token, clear the wishlist
      if (error.response && error.response.status === 401) {
        setWishlistItems([]);
      }
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    // If no token, show an error and return
    if (!token) {
      toast.error("Please login to add items to your wishlist.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWishlist(); // Refresh wishlist
      toast.success("Item added to wishlist!"); // Show success toast
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Failed to add item to wishlist."); // Show error toast
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    // If no token, show an error and return
    if (!token) {
      toast.error("Please login to remove items from your wishlist.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/remove`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWishlist(); // Refresh wishlist
      toast.success("Item removed from wishlist!"); // Show success toast
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove item from wishlist."); // Show error toast
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
