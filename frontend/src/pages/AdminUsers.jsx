import { useState, useEffect } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users") // Backend se users fetch karna
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setUsers(users.filter((user) => user._id !== id)));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center border">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.isAdmin ? "Admin" : "User"}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(user._id)}
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

export default AdminUsers;
