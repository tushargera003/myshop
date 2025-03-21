import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user came from the checkout page
  useEffect(() => {
    if (!location.state?.fromCheckout) {
      navigate("/"); // Redirect to home if accessed directly
    }
  }, [location.state, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex flex-col items-center p-8 space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-green-500"
      >
        <FiCheckCircle size={80} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl font-bold text-green-600"
      >
        Order Placed Successfully! 🎉
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center text-gray-700 text-lg max-w-md"
      >
        Thank you for shopping with us. Your order has been placed and is being
        processed. Get ready for a delightful experience – your package is on
        its way! 🚚
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Link
          to="/products"
          className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;
