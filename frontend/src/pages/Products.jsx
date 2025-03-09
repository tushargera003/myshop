import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const { addToCart } = useContext(CartContext); // Use addToCart from CartContext
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  // Fetch products with search and sort
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/admin/products/public?search=${searchTerm}&sort=${sortOption}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [searchTerm, sortOption]);

  // Add item to cart
  const handleAddToCart = (product) => {
    addToCart(product._id, 1); // Use addToCart from CartContext
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Toggle wishlist
  const handleWishlist = (product) => {
    const isInWishlist = wishlistItems.some(
      (item) => item.product._id === product._id
    );
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto p-6"
    >
      <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-8">
        🌟 Our Featured Products
      </h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Name: A to Z</option>
          <option value="nameDesc">Name: Z to A</option>
        </select>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No products found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {products.map((product) => {
            const isInWishlist = wishlistItems.some(
              (item) => item.product._id === product._id
            );
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-200 relative"
              >
                {/* Heart Icon */}
                <button
                  onClick={() => handleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
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

                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-contain"
                  />
                  <h2 className="text-xl font-bold text-gray-800 mt-4">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-lg font-semibold text-gray-600 mt-2">
                  ₹{product.price}
                </p>
                <button
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:scale-105 transition-all shadow-md"
                  onClick={() => handleAddToCart(product)}
                >
                  🛒 Add to Cart
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Products;
