import { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleToggleAdmin = (id, isAdmin) => {
    fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isAdmin: !isAdmin }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
      });
  };

  const handleDeleteUser = (id) => {
    fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => setUsers(users.filter((user) => user._id !== id)));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {users.map((user) => (
        <div
          key={user._id}
          className="border p-4 mb-2 flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
              className={`px-4 py-2 ${
                user.isAdmin ? "bg-gray-500" : "bg-blue-500"
              } text-white`}
            >
              {user.isAdmin ? "Remove Admin" : "Make Admin"}
            </button>

            <button
              onClick={() => handleDeleteUser(user._id)}
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

export default UserManagement;
