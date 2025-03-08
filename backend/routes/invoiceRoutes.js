import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Order from '../models/OrderModel.js';
import express from "express";
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
router.get('/invoice/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user').populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to access this order' });
    }

    const doc = new PDFDocument();
    const invoicePath = path.join(__dirname, `../../invoices/invoice_${order._id}.pdf`);

    doc.pipe(fs.createWriteStream(invoicePath));
    doc.pipe(res);

    doc.fontSize(25).text('Invoice', 100, 80);
    doc.fontSize(14).text(`Order ID: ${order._id}`, 100, 120);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`, 100, 140);
    doc.text(`Status: ${order.status}`, 100, 160);
    doc.text(`Payment Method: ${order.paymentMethod}`, 100, 180);
    doc.text(`Total Amount: ₹${order.discountedTotal}`, 100, 200);

    doc.text('Shipping Address:', 100, 240);
    doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`, 100, 260);

    doc.text('Order Items:', 100, 300);
    let y = 320;
    order.orderItems.forEach(item => {
      doc.text(`${item.name} - ₹${item.price} x ${item.qty} = ₹${item.price * item.qty}`, 100, y);
      y += 20;
    });

    doc.end();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id}.pdf`);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;