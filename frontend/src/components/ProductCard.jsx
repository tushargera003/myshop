import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-200"
    >
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-contain"
        />
        <h2 className="text-xl font-bold text-gray-800 mt-4">{product.name}</h2>
      </Link>
      <p className="text-lg font-semibold text-gray-600 mt-2">
        ₹{product.price}
      </p>
    </motion.div>
  );
};

export default ProductCard;
