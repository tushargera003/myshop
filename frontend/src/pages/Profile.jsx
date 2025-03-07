import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiSave, FiX, FiUser } from "react-icons/fi"; // Import icons

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setUpdatedUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: "",
        });
      });
  }, []);

  const handleUpdate = async (field) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ [field]: updatedUser[field] }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditMode({ ...editMode, [field]: false });
        toast.success(`${field} updated successfully!`);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-500 p-4 rounded-full shadow-lg">
            <FiUser className="text-white text-4xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          User Profile
        </h1>
        {user && (
          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex items-center justify-between">
              <p className="text-lg">
                <strong>Name:</strong> {user.name}
              </p>
              {editMode.name ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={updatedUser.name}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, name: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleUpdate("name")}
                    className="text-green-600 hover:text-green-800 transition-all"
                  >
                    <FiSave size={20} />
                  </button>
                  <button
                    onClick={() => setEditMode({ ...editMode, name: false })}
                    className="text-red-600 hover:text-red-800 transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setEditMode({ ...editMode, name: true })}
                  className="text-blue-600 hover:text-blue-800 transition-all"
                >
                  <FiEdit size={20} />
                </button>
              )}
            </div>

            {/* Email Field */}
            <div className="flex items-center justify-between">
              <p className="text-lg">
                <strong>Email:</strong> {user.email}
              </p>
              {editMode.email ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="email"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={updatedUser.email}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, email: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleUpdate("email")}
                    className="text-green-600 hover:text-green-800 transition-all"
                  >
                    <FiSave size={20} />
                  </button>
                  <button
                    onClick={() => setEditMode({ ...editMode, email: false })}
                    className="text-red-600 hover:text-red-800 transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setEditMode({ ...editMode, email: true })}
                  className="text-blue-600 hover:text-blue-800 transition-all"
                >
                  <FiEdit size={20} />
                </button>
              )}
            </div>

            {/* Phone Field */}
            <div className="flex items-center justify-between">
              <p className="text-lg">
                <strong>Phone:</strong> {user.phone}
              </p>
              {editMode.phone ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={updatedUser.phone}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, phone: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleUpdate("phone")}
                    className="text-green-600 hover:text-green-800 transition-all"
                  >
                    <FiSave size={20} />
                  </button>
                  <button
                    onClick={() => setEditMode({ ...editMode, phone: false })}
                    className="text-red-600 hover:text-red-800 transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setEditMode({ ...editMode, phone: true })}
                  className="text-blue-600 hover:text-blue-800 transition-all"
                >
                  <FiEdit size={20} />
                </button>
              )}
            </div>

            {/* Password Field */}
            <div className="flex items-center justify-between">
              <p className="text-lg">
                <strong>Password:</strong> ********
              </p>
              {editMode.password ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="password"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="New Password"
                    value={updatedUser.password}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        password: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleUpdate("password")}
                    className="text-green-600 hover:text-green-800 transition-all"
                  >
                    <FiSave size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setEditMode({ ...editMode, password: false })
                    }
                    className="text-red-600 hover:text-red-800 transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setEditMode({ ...editMode, password: true })}
                  className="text-blue-600 hover:text-blue-800 transition-all"
                >
                  <FiEdit size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
