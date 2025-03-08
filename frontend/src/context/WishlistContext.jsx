import { createContext, useState, useEffect } from "react";
import axios from "axios";

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
      console.error("No token found. User is not logged in.");
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
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    // If no token, show an error and return
    if (!token) {
      console.error("No token found. User is not logged in.");
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
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
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
