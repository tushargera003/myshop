import express from "express";
import Wishlist from "../models/WishlistModel.js";
import Product from "../models/ProductModel.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get wishlist for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    res.status(200).json(wishlist?.items || []);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to wishlist
router.post("/add", protect, async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      wishlist.items.push({ product: productId });
      await wishlist.save();
    }

    res.status(200).json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from wishlist
router.post("/remove", protect, async (req, res) => {
  const { productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;