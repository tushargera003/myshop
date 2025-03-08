import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx"; // Importing Cart Context
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Animations
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart } = useContext(CartContext); // Using Context

  const handleCheckout = async () => {
    try {
      if (cartItems.some((item) => !item.product || !item.product._id)) {
        toast.error(
          "One or more products in your cart are invalid. Please refresh."
        );
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/validate-stock`,
        {
          items: cartItems.map((item) => ({
            product: item.product._id,
            qty: item.qty,
          })),
        }
      );

      // Stock valid hai toh checkout page pe bhej do
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during stock validation. Please try again."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto p-4 sm:p-8"
    >
      <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-blue-600 mb-8">
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 text-lg"
        >
          Your cart is empty! Start shopping now.
        </motion.p>
      ) : (
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md p-4 sm:p-8 rounded-lg shadow-xl border border-gray-200">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={`${item._id}-${item.product?._id || "undefined"}`} // Use optional chaining
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 py-5"
              >
                {/* Product Image */}
                <img
                  src={item.product?.image} // Use optional chaining
                  alt={item.product?.name} // Use optional chaining
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl shadow-md"
                />

                {/* Product Info */}
                <div className="flex-grow ml-0 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {item.product?.name} {/* Use optional chaining */}
                  </h2>
                  <p className="text-gray-600 text-lg font-medium">
                    ₹{item.product?.price} {/* Use optional chaining */}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center mt-4 sm:mt-0">
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l transition-transform hover:scale-110"
                    onClick={() =>
                      updateQty(item.product._id, Math.max(1, item.qty - 1))
                    }
                  >
                    -
                  </button>
                  <span className="px-5 text-lg font-medium">{item.qty}</span>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r transition-transform hover:scale-110"
                    onClick={() => updateQty(item.product._id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-0 sm:ml-6 mt-4 sm:mt-0 px-4 sm:px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition-all"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cart Summary */}
          <div className="text-center sm:text-right mt-6">
            <p className="text-2xl font-bold text-gray-700">
              Total: ₹
              {cartItems.reduce(
                (acc, item) => acc + (item.product?.price || 0) * item.qty,
                0
              )}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-5 px-6 sm:px-8 py-3 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              🛍️ Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
