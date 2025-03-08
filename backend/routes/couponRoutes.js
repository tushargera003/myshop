import express from "express";
import Coupon from "../models/CouponModel.js"; // Import the Coupon model
const router = express.Router();

// Apply Coupon Endpoint
router.post("/apply-coupon", async (req, res) => {
    const { code, userId, cartTotal } = req.body;
  
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found ❌" });
      }
  
      // Check if coupon is expired
      const currentDate = new Date();
      if (currentDate > coupon.validUntil) {
        return res.status(400).json({ message: "Coupon has expired ❌" });
      }
  
      // Check if coupon has reached its usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached ❌" });
      }
  
      // Check if user has already used the coupon
      if (coupon.usersUsed.includes(userId)) {
        return res.status(400).json({ message: "Coupon already used ❌" });
      }
  
      // Check if cart meets the minimum value requirement
      if (cartTotal < coupon.minCartValue) {
        return res.status(400).json({
          message: `Minimum cart value of ₹${coupon.minCartValue} required ❌`,
        });
      }
  
      let discountAmount = 0;
  
      // Calculate discount based on type
      if (coupon.discountType === "fixed") {
        discountAmount = coupon.discount; // Fixed discount
      } else if (coupon.discountType === "percentage") {
        discountAmount = (coupon.discount / 100) * cartTotal; // Percentage discount
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount); // Apply max discount limit
        }
      }
  
      res.status(200).json({
        discount: discountAmount,
        message: "Coupon applied successfully! 🎉",
        couponId: coupon._id, // Send coupon ID for later use
      });
    } catch (error) {
      console.error("Error applying coupon:", error);
      res.status(500).json({ message: "Server error ❌" });
    }
  });

export default router;