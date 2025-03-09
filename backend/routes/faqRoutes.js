import express from "express";
import {
  createFAQ,
  getFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  chatbotResponse,
} from "../controllers/faqController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", protect, admin, createFAQ);
router.put("/:id", protect, admin, updateFAQ);
router.delete("/:id", protect, admin, deleteFAQ);

// Public routes
router.get("/", getFAQs);
router.get("/:id", getFAQById);

// Chatbot response
router.post("/chatbot", chatbotResponse);

export default router;