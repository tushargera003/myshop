import { useEffect, useState } from "react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const handleUpdateStatus = (id, status) => {
    fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updatedOrder) => {
        setOrders(
          orders.map((order) => (order._id === id ? updatedOrder : order))
        );
      });
  };

  const handleDeleteOrder = (id) => {
    fetch(`/api/admin/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => setOrders(orders.filter((order) => order._id !== id)));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 mb-2 flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>
          </div>

          <div className="flex space-x-2">
            <select
              value={order.status}
              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
              className="border p-2"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button
              onClick={() => handleDeleteOrder(order._id)}
              className="bg-red-500 text-white px-4 py-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;
