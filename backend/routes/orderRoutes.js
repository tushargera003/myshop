import express from "express";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js"; 
import {protect} from "../middleware/authMiddleware.js";
import Coupon from "../models/CouponModel.js";
import mongoose from "mongoose";

//for invoices
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const fontPath = path.join(__dirname, '../fonts/NotoSans-Regular.ttf');

// Get user orders
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("coupon");;
  res.json(orders);
});

// Create Order
router.post("/", async (req, res) => {
  try {
    const { user, items, totalAmount, paymentMethod } = req.body;
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
    const { items, originalTotal, discountedTotal, shippingAddress, paymentMethod, couponId } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items cannot be empty" });
    }

    const orderItems = items.map((item) => ({
      ...item,
      product: new mongoose.Types.ObjectId(item.product),
    }));

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      originalTotal, // Save original total
      discountedTotal, // Save discounted total
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod,
      isPaid: paymentMethod === "COD" ? false : true,
      paidAt: paymentMethod === "COD" ? null : new Date(),
      isDelivered: false,
      deliveredAt: null,
      coupon: couponId || null,
    });

    const createdOrder = await order.save();

    // Update stock for each product in the order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.qty; // Reduce the stock
        await product.save();
      }
    }

    if (couponId) {
      await Coupon.findByIdAndUpdate(couponId, {
        $inc: { usedCount: 1 },
        $push: { usersUsed: req.user._id },
      });
    }

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

router.post("/validate-stock", async (req, res) => {
  const { items } = req.body; 

  try {
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.countInStock}, Requested: ${item.qty}` 
        });
      }
    }
    res.status(200).json({ message: "Stock validated successfully" });
  } catch (error) {
    console.error("Stock validation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/invoice/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user')
      .populate('orderItems.product')
      .populate('coupon'); // Populate coupon details

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to access this order' });
    }

    const invoiceName = `invoice_${order._id}.pdf`;
    const invoicePath = path.join(__dirname, '../invoices', invoiceName);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);

    doc.pipe(fs.createWriteStream(invoicePath)); // Save to server
    doc.pipe(res); // Send to user

    // 🏢 Shop Name & Contact Info
    doc
      .font(fontPath)
      .fontSize(24)
      .fillColor('#333333') // Dark gray color
      .text('MyShop', { align: 'center' })
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#666666') // Gray color
      .text('Email: tushargera006@gmail.com', { align: 'center' })
      .text('Phone: 7053371296', { align: 'center' })
      .moveDown(2);

    // 📄 Invoice Title
    doc
      .font(fontPath)
      .fontSize(18)
      .fillColor('#000000') // Black color
      .text('INVOICE', { align: 'left', underline: true })
      .moveDown(1);

    // 🆔 Order Details
    doc
      .font(fontPath)
      .fontSize(12)
      .fillColor('#444444') // Dark gray color
      .text(`Order ID: ${order._id}`)
      .text(`Order Placed At: ${order.createdAt.toLocaleString()}`) // Add order placement time
      .text(`Status: ${order.status}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .moveDown(2);

    // 📍 Shipping Address
    doc
      .font(fontPath)
      .fontSize(12)
      .fillColor('#000000') // Black color
      .text('Shipping Address:', { underline: true })
      .moveDown(0.5)
      .font(fontPath)
      .fillColor('#444444') // Dark gray color
      .text(`${order.shippingAddress.address}`)
      .text(`${order.shippingAddress.city}, ${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`)
      .text(`Phone: ${order.shippingAddress.phone}`)
      .moveDown(2);

    // 🎫 Coupon Details (if applied)
    if (order.coupon) {
      doc
        .font(fontPath)
        .fontSize(12)
        .fillColor('#000000') // Black color
        .text('Coupon Details:', { underline: true })
        .moveDown(0.5)
        .font(fontPath)
        .fillColor('#444444') // Dark gray color
        .text(`Coupon Code: ${order.coupon.code}`)
        .text(`Discount: ₹${order.originalTotal - order.discountedTotal}`)
        .text(`Final Price After Discount: ₹${order.discountedTotal}`)
        .moveDown(2);
    }

    // 🛒 Order Items Table
    doc
      .font(fontPath)
      .fontSize(12)
      .fillColor('#000000') // Black color
      .text('Order Items:', { underline: true })
      .moveDown(1);

    // Table Headers
    const tableTop = doc.y;
    const columnWidths = [200, 80, 100, 100]; // Adjusted column widths
    const tableX = 50; // Starting X position of the table

    // Draw table header background
    doc
      .rect(tableX, tableTop, 500, 20)
      .fill('#333333'); // Dark gray background

    // Add table headers
    doc
      .font(fontPath)
      .fontSize(12)
      .fillColor('#FFFFFF') // White color
      .text('Product', tableX + 5, tableTop + 5)
      .text('Qty', tableX + columnWidths[0] + 10, tableTop + 5)
      .text('Price', tableX + columnWidths[0] + columnWidths[1] + 15, tableTop + 5)
      .text('Total', tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 20, tableTop + 5);

    let y = tableTop + 25; // Starting Y position for table rows

    // Add table rows
    order.orderItems.forEach((item) => {
      const price = item.price.toFixed(2).toString();
      const total = (item.price * item.qty).toFixed(2).toString();

      doc
        .font(fontPath)
        .fontSize(11)
        .fillColor('#444444') // Dark gray color
        .text(item.product.name, tableX + 5, y, { width: columnWidths[0], align: 'left' })
        .text(`${item.qty}`, tableX + columnWidths[0] + 10, y, { width: columnWidths[1], align: 'right' })
        .text(`₹${price}`, tableX + columnWidths[0] + columnWidths[1] + 15, y, { width: columnWidths[2], align: 'right' })
        .text(`₹${total}`, tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 20, y, { width: columnWidths[3], align: 'right' });

      y += 20; // Move to the next row
    });

    // 💰 Total Amount
    const totalAmount = order.discountedTotal.toFixed(2).toString();
    doc
      .moveDown(2)
      .font(fontPath)
      .fontSize(14)
      .fillColor('#000000') // Black color
      .text(`Total Amount: ₹${totalAmount}`, tableX + 350, y + 20, { align: 'right' })
      .moveDown(2);

    // ✍️ Signature (Stylish and Tilted)
    doc
      .font(fontPath)
      .fontSize(12)
      .fillColor('#444444') // Dark gray color
      .text('Thank you for shopping with us!', tableX, y + 50);

    // Add a stylish and tilted signature
    doc
      .save() // Save the current state
      .rotate(-10) // Tilt the signature by -10 degrees
      .font(fontPath)
      .fontSize(14)
      .fillColor('#000000') // Black color
      .text('Signature: ___________________', tableX, y + 80)
      .text('Tushar Gera', tableX + 80, y + 80)
      .restore(); // Restore the original state

    // 📌 Footer
    const footerY = 750;
    doc.on('pageAdded', () => {
      doc
        .font(fontPath)
        .fontSize(10)
        .fillColor('#666666') // Gray color
        .text('MyShop - Your one-stop shop for everything!', tableX, footerY, { align: 'center' });
    });

    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;