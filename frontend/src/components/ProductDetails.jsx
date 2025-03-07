import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const { setCartItems } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/product/${id}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    setCartItems((prev) => [...prev, { ...product, qty: 1 }]);
    toast.success(`${product.name} added to cart!`);
  };

  if (!product) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="flex flex-col md:flex-row items-center gap-10">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-96 h-96 object-contain rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        />

        <div>
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">₹{product.price}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>

          <button
            onClick={addToCart}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all shadow-md"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
