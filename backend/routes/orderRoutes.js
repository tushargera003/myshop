import express from "express";
import Order from "../models/OrderModel.js";
import {protect} from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
const router = express.Router();

// Get user orders
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});


// Create Order
router.post("/", async (req, res) => {
  try {
    
    const { user, items, totalAmount, paymentMethod } = req.body;
    console.log("Request Body:", req.body);
    const newOrder = new Order({
      user,
      items,
      totalAmount,
      paymentMethod,
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

//cod order
router.post("/cod", protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    console.log("Request Body:", req.body);
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items cannot be empty" });
    }

    // Ensure each item's product field is a valid ObjectId
    const orderItems = items.map((item) => ({
      ...item,
      product: new mongoose.Types.ObjectId(item.product), // Correctly cast to ObjectId
    }));

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice: totalAmount,
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod,
      isPaid: paymentMethod === "COD" ? false : true,
      paidAt: paymentMethod === "COD" ? null : new Date(),
      isDelivered: false,
      deliveredAt: null,
    });

    const createdOrder = await order.save();
    res.status(201).json({ message: "Order placed successfully", order: createdOrder });
  } catch (error) {
    console.error("COD Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Cancel Order Route
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to cancel this order" });
    }

    if (order.status === "Pending" || order.status === "Processing") {
      order.status = "Cancelled";
      await order.save();
      return res.json({ message: "Order cancelled successfully" });
    } else {
      return res.status(400).json({ message: "Order cannot be cancelled after it is shipped" });
    }
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
