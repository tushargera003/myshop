
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
// Google Auth Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);