import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import useUser from "../hooks/useUser";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { user, loading, updateUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { autoClose: 2000 });
    updateUser();
    navigate("/auth");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileOpen &&
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".mobile-profile-dropdown")
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);

  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

  if (loading) return null;

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold tracking-wide">
          MyShop
        </Link>

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
            to="/about"
            className={`hover:text-gray-200 transition ${
              location.pathname === "/about" ? "font-bold underline" : ""
            }`}
          >
            About Us
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
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      My Wishlist
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

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

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
              to="/about"
              className={`block hover:text-gray-200 transition ${
                location.pathname === "/about" ? "font-bold underline" : ""
              }`}
            >
              About Us
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
              <div className="relative mobile-profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2"
                >
                  <User size={24} />
                  <span>Profile</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-white text-black shadow-lg rounded-lg w-48"
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
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        My Wishlist
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
