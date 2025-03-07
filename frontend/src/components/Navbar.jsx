import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import useUser from "../hooks/useUser"; // Import the useUser hook

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { user, loading } = useUser(); // Use the useUser hook
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Close dropdown and mobile menu when location changes
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
    window.location.reload(); // Reload the page to reset the state
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest(".profile-dropdown")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);

  // Calculate total items in cart
  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

  if (loading) {
    return null; // Show nothing while loading
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-wide">
          MyShop
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-lg font-medium">
          <Link
            to="/"
            className={`hover:text-gray-200 transition ${
              location.pathname === "/" ? "font-bold underline" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`hover:text-gray-200 transition ${
              location.pathname === "/products" ? "font-bold underline" : ""
            }`}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className={`hover:text-gray-200 transition relative flex items-center ${
              location.pathname === "/cart" ? "font-bold underline" : ""
            }`}
          >
            <ShoppingCart size={22} className="mr-1" /> Cart
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-2 -right-4 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="hover:text-gray-200">
              Admin Panel
            </Link>
          )}
          {user ? (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2"
              >
                <User size={24} />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-48"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/auth"
              className={`hover:text-gray-200 transition ${
                location.pathname === "/auth" ? "font-bold underline" : ""
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-blue-700 p-4 space-y-2 mt-2 text-lg font-medium"
          >
            <Link
              to="/"
              className={`block hover:text-gray-200 transition ${
                location.pathname === "/" ? "font-bold underline" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block hover:text-gray-200 transition ${
                location.pathname === "/products" ? "font-bold underline" : ""
              }`}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className={`block hover:text-gray-200 transition relative flex items-center ${
                location.pathname === "/cart" ? "font-bold underline" : ""
              }`}
            >
              <ShoppingCart size={22} className="mr-1" /> Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative flex items-center space-x-4">
                <span className="text-lg font-medium">Hello, {user.name}</span>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2"
                >
                  <User size={24} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-48"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`hover:text-gray-200 transition ${
                  location.pathname === "/auth" ? "font-bold underline" : ""
                }`}
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
