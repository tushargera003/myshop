import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { WishlistContext } from "../context/WishlistContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${id}`
        );
        const data = await response.json();
        setProduct(data);
        fetchSimilarProducts(data.category);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch similar products
  const fetchSimilarProducts = async (category) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/products/public?category=${category}`
      );
      const data = await response.json();
      setSimilarProducts(data.filter((p) => p._id !== id).slice(0, 4));
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  // Toggle wishlist for main product
  const handleWishlist = () => {
    const isInWishlist = wishlistItems.some(
      (item) => item.product._id === product._id
    );
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  // Toggle wishlist for similar products
  const handleSimilarWishlist = (product) => {
    const isInWishlist = wishlistItems.some(
      (item) => item.product._id === product._id
    );
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  if (!product) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      {/* Product Details Section */}
      <div className="flex flex-col md:flex-row items-center bg-white/70 backdrop-blur-md gap-10 mb-16 p-6 rounded-lg shadow-lg">
        {/* Product Image */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-96 h-96 object-contain rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">₹{product.price}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>

          {/* Add to Cart and Wishlist Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => addToCart(product._id, 1)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all shadow-md"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all shadow-md"
            >
              {wishlistItems.some((item) => item.product._id === product._id)
                ? "❤️ Remove from Wishlist"
                : "❤️ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Similar Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {similarProducts.map((similarProduct) => {
            const isInWishlist = wishlistItems.some(
              (item) => item.product._id === similarProduct._id
            );
            return (
              <motion.div
                key={similarProduct._id}
                className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <Link to={`/product/${similarProduct._id}`}>
                  <img
                    src={similarProduct.image}
                    alt={similarProduct.name}
                    className="w-full h-56 object-contain"
                  />
                  <h2 className="text-xl font-bold text-gray-800 mt-4">
                    {similarProduct.name}
                  </h2>
                </Link>
                <p className="text-lg font-semibold text-gray-600 mt-2">
                  ₹{similarProduct.price}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(similarProduct._id, 1);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all shadow-md"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimilarWishlist(similarProduct);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${
                        isInWishlist
                          ? "text-red-500 fill-current"
                          : "text-gray-500"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
