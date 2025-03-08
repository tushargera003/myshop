import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Store coupon code in uppercase
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"], // Fixed or percentage discount
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number, // Maximum discount for percentage coupons
      default: null, // No limit by default
    },
    minCartValue: {
      type: Number, // Minimum cart value to apply the coupon
      default: 0, // No minimum by default
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number, // Total usage limit for the coupon
      default: null, // No limit by default
    },
    usedCount: {
      type: Number, // Track how many times the coupon has been used
      default: 0,
    },
    usersUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Track which users have used the coupon
      },
    ],
  });
  
  const Coupon = mongoose.model("Coupon", couponSchema);
  
  export default Coupon;