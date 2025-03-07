import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import AdminLayout from "./components/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import ProductDetails from "./components/ProductDetails";
import useUser from "./hooks/useUser"; // Import the custom hook

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const PaymentPage = lazy(() => import("./pages/Paymentpage"));
const Auth = lazy(() => import("./pages/Auth"));

// Admin Routes
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));

function App() {
  const { user, loading } = useUser(); // Fetch user details

  if (loading) {
    return <div className="text-center">Loading...</div>; // Show loading state
  }

  return (
    <CartProvider>
      <Router>
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
        <Navbar user={user} /> {/* Pass user to Navbar */}
        <div className="min-h-screen">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/auth" element={<Auth />} />

              {/* Admin Routes - Always defined */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
        <Footer />
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
