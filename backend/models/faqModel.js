import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      unique: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Shipping", "Payments", "Returns", "General"],
      default: "General",
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;