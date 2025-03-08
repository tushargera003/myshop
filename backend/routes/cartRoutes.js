import express from "express";
import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get cart for the logged-in user
// Get cart for the logged-in user
router.get("/", protect, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: "items.product",
        select: "name image price", // Select only required fields
      });
  
      if (!cart) {
        return res.status(200).json({ items: [] }); // Return empty items array if cart not found
      }
      res.status(200).json(cart); // Return the entire cart object
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

// Add item to cart
router.post("/add", protect, async (req, res) => {
  const { productId, qty } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].qty += qty;
    } else {
      cart.items.push({ product: productId, qty });
    }

    await cart.save();
    res.status(200).json(cart.items); // Return updated cart items
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update item quantity in cart
router.post("/update", protect, async (req, res) => {
  const { productId, qty } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].qty = qty;
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    res.status(200).json(cart.items); // Return updated cart items
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.post("/remove", protect, async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart.items); // Return updated cart items
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Clear cart
router.post("/clear", protect, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      cart.items = []; // Clear cart items
      await cart.save();
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
export default router;