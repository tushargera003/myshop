import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http"; // Import http module
import { Server } from "socket.io"; // Import Socket.IO
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Import Chat Routes
import faqRoutes from "./routes/faqRoutes.js"; // Import FAQ Routes
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

dotenv.config();

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://myshop-teal-nine.vercel.app",
      "https://myshop-pro.vercel.app",
      "https://myshop-pro-git-main-tushar-geras-projects.vercel.app",
      "https://myshop-rbiw5xtjf-tushar-geras-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
}); // Initialize Socket.IO

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 1000 requests per IP
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://myshop-teal-nine.vercel.app",
      "https://myshop-pro.vercel.app",
      "https://myshop-pro-git-main-tushar-geras-projects.vercel.app",
      "https://myshop-rbiw5xtjf-tushar-geras-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(compression());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api", couponRoutes);
app.use("/api/chat", chatRoutes); // Add Chat Routes
app.use("/api/faq", faqRoutes); // Add FAQ Routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(5000, () => console.log("Server running on port 5000")); // Use server.listen instead of app.listen
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is working properly!");
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room based on the user's ID
  socket.on("joinRoom", (userId) => {
    socket.join(userId); // Join the room with the user's ID
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Listen for chat messages
  socket.on("sendMessage", (message) => {
    const { receiver } = message; // Extract the receiver's ID from the message
    io.to(receiver).emit("newMessage", message); // Emit the message only to the receiver's room
    console.log(`Message sent to ${receiver}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Pass the socket object to the chat controller
app.set("socketio", io);