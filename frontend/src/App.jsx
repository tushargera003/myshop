import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import AdminLayout from "./components/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import ProductDetails from "./components/ProductDetails";
import AboutUs from "./pages/AboutUs.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./components/ChatWidget";
import AdminChat from "./components/AdminChat.jsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Auth = lazy(() => import("./pages/Auth"));

// Admin Routes
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));

import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
          />
          <Navbar />
          <div className="min-h-screen">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route
                    path="/order-confirmation"
                    element={<OrderConfirmation />}
                  />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="chatbot" element={<AdminChat />} />
                  <Route path="products" element={<AdminProducts />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <ChatWidget />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
