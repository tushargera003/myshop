import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Frontend validation for signup
    if (!isLogin && (!formData.name || !formData.email || !formData.phone)) {
      toast.error("Name, Email, and Phone are required for signup");
      setIsLoading(false);
      return;
    }

    try {
      const url = isLogin
        ? `${import.meta.env.VITE_BACKEND_URL}/api/user/login`
        : `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`;

      // Prepare data for login
      const loginData = isLogin
        ? {
            [loginMethod === "email" ? "email" : "phone"]:
              loginMethod === "email" ? formData.email : formData.phone,
            password: formData.password,
          }
        : formData;

      console.log("Sending Data:", loginData);
      const { data } = await axios.post(url, loginData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(
        isLogin ? "Login Successful!" : "Signup Successful! Logging in..."
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => {
        window.location.reload(); // Refresh page to reflect login state
      }, 2000);
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Agar login hai toh home page pe bhej do
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 px-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl flex relative overflow-hidden"
        style={{ height: "500px" }}
      >
        {/* Left Side - Form Container */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10">
          <motion.h2
            key={isLogin ? "login-heading" : "signup-heading"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold mb-6 text-gray-800"
          >
            {isLogin ? "Login" : "Sign Up"}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {!isLogin && (
              <motion.input
                key="name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {!isLogin && (
              <motion.input
                key="email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {!isLogin && (
              <motion.input
                key="phone"
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Login Method Toggle */}
            {isLogin && (
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    loginMethod === "email"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    loginMethod === "phone"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Phone
                </button>
              </div>
            )}

            {/* Email or Phone Input */}
            {isLogin && (
              <input
                type={loginMethod === "email" ? "email" : "text"}
                name={loginMethod === "email" ? "email" : "phone"}
                placeholder={
                  loginMethod === "email" ? "Email Address" : "Phone Number"
                }
                value={
                  loginMethod === "email" ? formData.email : formData.phone
                }
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className={`w-full mt-4 p-3 text-white rounded-lg transition-all duration-300 ${
                isLogin
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-purple-600 hover:bg-purple-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6 flex justify-center">
            <button className="p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-all flex items-center gap-2 px-4">
              <FcGoogle className="w-6 h-6" />
              <span className="text-gray-700 font-medium">
                {isLogin ? "Login" : "Sign Up"} with Google
              </span>
            </button>
          </div>

          {/* Toggle Option */}
          <p className="text-gray-600 text-center mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-blue-600 cursor-pointer font-medium hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>

        {/* Right Side - Animated Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-1/2 flex items-center justify-center p-10 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-all duration-500"
        >
          <motion.div
            key={isLogin ? "login-text" : "signup-text"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Join Us Today!"}
            </h2>
            <p className="text-lg">
              {isLogin
                ? "Log in to continue and explore our amazing features. Stay connected and enjoy seamless experiences!"
                : "Create an account now and unlock a world of possibilities. Join our community and get started today!"}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
