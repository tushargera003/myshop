import express from "express";
import User from "../models/UserModel.js";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import {protect , admin} from "../middleware/authMiddleware.js";
const router = express.Router();

// Get all users
router.get("/users",protect , admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a user
router.delete("/users/:id", protect , admin ,async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});
// Toggle Admin Status (Admin Only)
router.put("/users/:id", protect, admin, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isAdmin = req.body.isAdmin;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

// Get all orders
router.get("/orders",protect,admin, async (req, res) => {
    try {
      const orders = await Order.find({}).populate("user", "name email");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  // Update order status(admin only)
  router.put("/orders/:id", protect ,admin, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = req.body.status;
        await order.save();
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating order" });
    }
  });
  
  // Delete an order
  router.delete("/orders/:id",protect ,admin, async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order" });
    }
  });
  // Get all products (Admin Only)
  router.get("/products", protect, admin, async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });

  // Add a new product (Admin Only)
router.post("/products", protect,admin, async (req, res) => {
    const { name, price,image } = req.body;
    const product = new Product({ name, price , image });
    await product.save();
    res.json(product);
  });
  
  // Delete a product (Admin Only)
  router.delete("/products/:id", protect, admin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  });
  
//get route for single product
 // Correct implementation
// Updated route
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

  // Get admin stats
router.get("/stats", protect, admin, async (req, res) => {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();
    const revenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
  
    res.json({
      users: usersCount,
      orders: ordersCount,
      revenue: revenue[0]?.total || 0,
    });
  });
  
  router.get("/products/public", async (req, res) => {
    try {
      let { search, sort } = req.query;
      let query = {};
  
      // Search filter
      if (search) {
        query.name = { $regex: search, $options: "i" }; // Case-insensitive search
      }
  
      // Sorting logic
      let sortOption = {};
      if (sort === "priceAsc") sortOption.price = 1; // Low to High
      if (sort === "priceDesc") sortOption.price = -1; // High to Low
      if (sort === "nameAsc") sortOption.name = 1; // A-Z
      if (sort === "nameDesc") sortOption.name = -1; // Z-A
  
      const products = await Product.find(query).sort(sortOption);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  
export default router;
