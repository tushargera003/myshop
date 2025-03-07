import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx"; // Importing Cart Context
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Animations

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext); // Using Context

  // Quantity Update Function
  const updateQty = (id, qty) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, qty: qty } : item))
    );
  };

  // Remove Item Function
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto p-8"
    >
      <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-8">
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
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={`${item.id}-${item.name}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex items-center border-b border-gray-300 py-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded-xl shadow-md"
                />
                <div className="ml-6 flex-grow">
                  <h2 className="text-2xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600 text-lg font-medium">
                    ₹{item.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l transition-transform hover:scale-110"
                    onClick={() =>
                      updateQty(item.id, Math.max(1, item.qty - 1))
                    }
                  >
                    -
                  </button>
                  <span className="px-5 text-lg font-medium">{item.qty}</span>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r transition-transform hover:scale-110"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-6 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition-all"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cart Summary */}
          <div className="text-right mt-6">
            <p className="text-2xl font-bold text-gray-700">
              Total: ₹
              {cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)}
            </p>
            <Link
              to="/checkout"
              className="mt-5 px-8 py-3 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              🛍️ Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
