import { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx"; // Import CartContext
import { motion } from "framer-motion";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext); // Destructure clearCart
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart"); // Agar cart empty hai toh checkout nahi khulega
    }
  }, [cartItems, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    paymentMethod: "Paytm", // Default payment method
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const order = {
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty,
      })),
      totalAmount: cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      ),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.pincode,
        country: "India",
      },
      paymentMethod:
        formData.paymentMethod === "COD"
          ? "Cash on Delivery"
          : formData.paymentMethod,
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
        if (formData.paymentMethod === "COD") {
          // Redirect to Order Confirmation for COD
          navigate("/order-confirmation", { state: { fromCheckout: true } });
        } else {
          // Redirect to Payment Page for other methods
          navigate("/payment", { state: { order } });
        }
        setTimeout(() => clearCart(), 500); // Clear cart after navigation
      } else {
        console.error("Order submission failed");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
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
                  placeholder=" "
                  required
                  className="peer w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  onChange={handleChange}
                />
                <label className="absolute left-3 top-3 text-gray-400 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base transition-all peer-focus:top-3 peer-focus:text-sm peer-focus:text-blue-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}

            {/* Payment Method */}
            <select
              name="paymentMethod"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            >
              <option value="Paytm">Paytm</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="COD">Cash on Delivery (COD)</option>
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
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    ₹{item.price * item.qty}
                  </p>
                </motion.div>
              ))}
              <div className="border-t border-gray-300 pt-4 text-lg font-bold flex justify-between">
                <span>Total:</span>
                <span>
                  ₹
                  {cartItems.reduce(
                    (acc, item) => acc + item.price * item.qty,
                    0
                  )}
                </span>
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
