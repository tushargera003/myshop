import Product from "../models/ProductModel.js";
import express from "express";
const router = express.Router();

router.get("/products/public", async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/product/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  export default router;