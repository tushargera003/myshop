import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";;
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
dotenv.config();
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Max 100 requests per IP
    message: "Too many requests from this IP, please try again later.",
  });
  
  app.use(limiter);
  app.use(helmet());
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://myshop-teal-nine.vercel.app","https://myshop-pro.vercel.app","https://myshop-pro-git-main-tushar-geras-projects.vercel.app","https://myshop-rbiw5xtjf-tushar-geras-projects.vercel.app"],
      credentials: true,
    })
  );
app.use(express.json());
app.use(compression());
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api", couponRoutes);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected");
  app.listen(5000, () => console.log("Server running on port 5000"));
});
app.get("/", (req, res) => {
  res.send("Backend is working properly!");
});