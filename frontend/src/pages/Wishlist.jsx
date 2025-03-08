import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext.jsx"; // Import CartContext
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link for navigation

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext); // Use CartContext

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 min-h-screen"
    >
      <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-8">
        ❤️ Your Wishlist
      </h1>
      {wishlistItems.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 text-lg"
        >
          Your wishlist is empty! Start adding products.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {wishlistItems.map((item) => (
            <motion.div
              key={item.product._id}
              className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
            >
              {/* Product Image with Link */}
              <Link to={`/product/${item.product._id}`}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-48 object-contain rounded-lg hover:scale-105 transition-all"
                />
              </Link>

              {/* Product Name and Price */}
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {item.product.name}
              </h2>
              <p className="text-lg font-semibold text-gray-600 mt-2">
                ₹{item.product.price}
              </p>

              {/* Add to Cart and Remove from Wishlist Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    addToCart(item.product._id, 1); // Add to cart
                    toast.success("Added to cart!");
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-md"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(item.product._id);
                    toast.success("Removed from wishlist!");
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-md"
                >
                  ❤️ Remove
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Wishlist;
