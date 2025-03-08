import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  // Animation variants for Framer Motion
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h1
          className="text-5xl font-extrabold text-center text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          variants={fadeIn}
        >
          About Us
        </motion.h1>

        {/* Glassmorphism Card */}
        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-12 border border-white/20"
          variants={fadeIn}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={fadeIn}
          >
            Who We Are
          </motion.h2>
          <motion.p
            className="text-gray-700 text-lg leading-relaxed mb-6"
            variants={fadeIn}
          >
            We are a passionate team of developers, designers, and innovators
            dedicated to creating exceptional digital experiences. Our mission
            is to deliver high-quality solutions that empower businesses and
            individuals to achieve their goals.
          </motion.p>
          <motion.p
            className="text-gray-700 text-lg leading-relaxed mb-6"
            variants={fadeIn}
          >
            With years of experience and a commitment to excellence, we strive
            to push the boundaries of technology and design. Let's build
            something amazing together!
          </motion.p>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={staggerContainer}
        >
          {/* Phone Number */}
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex items-center border border-white/20 hover:shadow-lg transition-shadow"
            variants={fadeIn}
          >
            <div className="bg-blue-500 p-4 rounded-full mr-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Phone</h3>
              <p className="text-gray-700">+91 7053371296</p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex items-center border border-white/20 hover:shadow-lg transition-shadow"
            variants={fadeIn}
          >
            <div className="bg-purple-500 p-4 rounded-full mr-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Email</h3>
              <p className="text-gray-700">tushargera006@gmail.com</p>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex items-center border border-white/20 hover:shadow-lg transition-shadow"
            variants={fadeIn}
          >
            <div className="bg-green-500 p-4 rounded-full mr-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Address</h3>
              <p className="text-gray-700">New Delhi, India</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Google Map Iframe */}
        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20"
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Location
          </h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.54005051206!2d77.04417282005019!3d28.527252738038356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1741404676159!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "15px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
