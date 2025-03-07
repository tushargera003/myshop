import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500 text-white rounded shadow">
          <h2 className="text-xl">Total Users</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>

        <div className="p-4 bg-green-500 text-white rounded shadow">
          <h2 className="text-xl">Total Orders</h2>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>

        <div className="p-4 bg-yellow-500 text-white rounded shadow">
          <h2 className="text-xl">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{stats.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
