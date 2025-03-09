import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  getAdminUser,
//   adminGetUsers,
  adminGetConversations,
} from "../controllers/chatController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import User from "../models/UserModel.js";
import ChatMessage from "../models/chatModel.js";

const router = express.Router();

// Send a message
router.post("/send", protect, sendMessage);

// Get messages between two users
router.get("/:conversationId", protect, getMessages);

// Mark a message as read
router.put("/read/:messageId", protect, markAsRead);

// Get all users who have sent messages to the admin
// router.get("/users",protect ,admin,adminGetUsers);

router.get("/conversations", protect, admin, adminGetConversations);

router.get("/admin", protect, getAdminUser);

export default router;