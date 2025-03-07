import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      <motion.h1
        className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to MyShop 🛍️
      </motion.h1>

      <motion.p
        className="text-lg text-gray-800 mb-6 max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Find the best products at unbeatable prices! Elevate your shopping
        experience with us.
      </motion.p>

      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          🛒 Shop Now
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Home;
