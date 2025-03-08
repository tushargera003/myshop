import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal"; // Ensure this path is correct

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setIsModalOpen(true);
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/orders/cancel/${orderToCancel}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Order cancelled successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderToCancel
              ? { ...order, status: "Cancelled" }
              : order
          )
        );
      } else {
        toast.error(data.message || "Failed to cancel order", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const downloadInvoice = async (orderId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/invoice/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to download invoice", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mx-auto p-6"
    >
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
        📦 My Order History
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-300 hover:shadow-2xl transition-all ${
                expandedOrder === order._id ? "border-blue-500" : ""
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(order._id)}
              >
                <div>
                  <p
                    className="text-lg font-semibold text-gray-900 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(order._id)}
                    title="Click to copy Order ID"
                  >
                    🆔 Order ID: #{order._id}
                  </p>
                  {order.coupon ? (
                    <>
                      <p className="text-gray-700 font-medium">
                        💰 <strong>Total:</strong> ₹{order.originalTotal}
                      </p>
                      <p className="text-gray-700 font-medium">
                        🎫 <strong>Coupon Used:</strong> {order.coupon.code} (₹
                        {order.originalTotal - order.discountedTotal} off)
                      </p>
                      <p className="text-gray-700 font-medium">
                        💸 <strong>Final Total:</strong> ₹
                        {order.discountedTotal}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      💰 <strong>Total:</strong> ₹{order.originalTotal}
                    </p>
                  )}
                  <p className="text-gray-600">
                    📅 <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    📦 <strong>Status:</strong> {order.status}
                  </p>
                </div>
                {expandedOrder === order._id ? (
                  <FaChevronUp className="text-gray-600 text-xl" />
                ) : (
                  <FaChevronDown className="text-gray-600 text-xl" />
                )}
              </div>

              {expandedOrder === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 border-t pt-4 space-y-3"
                >
                  <p className="text-gray-700">
                    💳 <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                  <p className="text-gray-700">
                    ✅ <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-700">
                    🚚 <strong>Delivered:</strong>{" "}
                    {order.isDelivered ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-700">
                    📍 <strong>Shipping Address:</strong>{" "}
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country} -{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-700">
                    📞 <strong>Phone Number:</strong>{" "}
                    {order.shippingAddress.phone}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => downloadInvoice(order._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      Download Invoice
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      🛍 Ordered Products:
                    </h3>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 p-3 border rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-all"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <a
                              href={`/product/${
                                item.product?.$oid || item.product
                              }`}
                              className="text-blue-600 font-medium hover:underline"
                            >
                              {item.name}
                            </a>
                            <p className="text-gray-600">Qty: {item.qty}</p>
                            <p className="text-gray-600">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(order.status === "Pending" ||
                    order.status === "Processing") && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleCancelClick(order._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                      >
                        Cancel Order
                      </button>
                      <p className="text-sm text-gray-600 mt-2">
                        You can only cancel the order before it is shipped.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={cancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
      />
    </motion.div>
  );
};

export default OrderHistory;
