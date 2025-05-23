import { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx"; // Import CartContext
import { motion } from "framer-motion";
import axios from "axios"; // For coupon API call
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { cartItems = [], clearCart, loading } = useContext(CartContext);
  const navigate = useNavigate();

  // Coupon state
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponId, setCouponId] = useState(null);

  // Form state with default paymentMethod as "COD"
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    paymentMethod: "COD", // Set default to COD
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate totals safely using cartItems || []
  const total = (cartItems || []).reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const discountedTotal = Math.max(0, total - discount);

  const applyCoupon = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to apply the coupon.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const cartTotal = (cartItems || []).reduce(
        (acc, item) => acc + item.product.price * item.qty,
        0
      );
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/apply-coupon`,
        {
          code: coupon.toUpperCase(),
          userId,
          cartTotal,
        }
      );
      setDiscount(data.discount);
      setCouponApplied(true);
      setCouponId(data.couponId);
      setCouponMessage(data.message);
    } catch (error) {
      setCouponMessage(error.response?.data?.message || "Invalid coupon ❌");
    }
  };

  const removeDiscount = () => {
    setDiscount(0);
    setCouponApplied(false);
    setCouponMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to place your order.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.paymentMethod !== "COD") {
      toast.error("This payment method is currently not available.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const order = {
      items: (cartItems || []).map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        qty: item.qty,
      })),
      originalTotal: total,
      discountedTotal: discountedTotal,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.pincode,
        country: "India",
        phone: formData.phone,
      },
      paymentMethod:
        formData.paymentMethod === "COD"
          ? "Cash on Delivery"
          : formData.paymentMethod,
      couponId: couponApplied ? couponId : null,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/cod`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(order),
        }
      );
      if (response.ok) {
        navigate("/order-confirmation", { state: { fromCheckout: true } });
        setTimeout(() => clearCart(), 500);
      } else {
        console.error("Order submission failed");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading your cart...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto p-6"
    >
      <ToastContainer />
      <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-8">
        🛍️ Checkout
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-xl border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4">📋 Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "address", "city", "pincode", "phone"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "phone" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="peer w-full p-5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <label
                  className={`absolute left-3 top-0 text-gray-400 transition-all 
                    ${
                      formData[field]
                        ? "text-sm top-1 peer-focus:text-blue-500"
                        : "peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-sm peer-focus:text-blue-500"
                    }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}
            {/* Payment Method */}
            <select
              name="paymentMethod"
              value={formData.paymentMethod} // Controlled value
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Paytm">Paytm</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
            </select>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:scale-105 transition-all shadow-md"
            >
              ✅ Place Order
            </button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">🛒 Order Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty!</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-medium">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    ₹{item.product.price * item.qty}
                  </p>
                </motion.div>
              ))}
              {/* Coupon Section */}
              <div className="border-t border-gray-300 pt-4">
                {!couponApplied ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
                    <span className="text-green-700">🎉 {couponMessage}</span>
                    <button
                      onClick={removeDiscount}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {/* Totals */}
              <div className="border-t border-gray-300 pt-4 text-lg font-bold flex justify-between">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              {discount > 0 && (
                <div className="text-lg font-bold flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-4 text-lg font-bold flex justify-between">
                <span>Total:</span>
                <span>₹{discountedTotal}</span>
              </div>
              <Link
                to="/cart"
                className="block text-center bg-gray-300 text-gray-700 py-2 rounded-lg hover:scale-105 transition-all shadow-md"
              >
                🔄 Edit Cart
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout;
