import express from "express";
import User from "../models/UserModel.js";
import { protect } from "../middleware/authMiddleware.js"; // Correct import
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

// Get user profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Update user profile
// Update user profile
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update individual fields if provided
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.phone) user.phone = req.body.phone;

  // Hash password if provided
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  await user.save();
  res.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
});


// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, phone, role: "user" });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: {  name: newUser.name } });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post("/login", async (req, res) => {
  const { email, phone, password } = req.body;

  // Check if email or phone is provided
  if (!email && !phone) {
    return res.status(400).json({ message: "Email or Phone is required" });
  }

  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (!user) return res.status(400).json({ message: "User not found" });

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user: { name: user.name } });
});


// Backend route to fetch user details
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findById(decoded.id).select("-password"); // Fetch user details (excluding password)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send user details
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});
export default router;
