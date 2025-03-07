import { useState, useEffect } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders") // Backend se orders fetch karna
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedOrder) => {
        setOrders(
          orders.map((order) => (order._id === id ? updatedOrder : order))
        );
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/admin/orders/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setOrders(orders.filter((order) => order._id !== id)));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Orders</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center border">
              <td className="border p-2">{order.user.name}</td>
              <td className="border p-2">₹{order.totalAmount}</td>
              <td className="border p-2">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="border p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(order._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
