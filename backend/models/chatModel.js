import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    }, // Unique ID for the conversation
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Sender's user ID
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Receiver's user ID
    message: {
      type: String,
      required: true,
    }, // The message content
    isRead: {
      type: Boolean,
      default: false,
    }, // Whether the message is read
    isAdmin: {
      type: Boolean,
      default: false,
    }, // Whether the message is sent by admin
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    }, // Link to an order (if applicable)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    }, // Link to a product (if applicable)
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;