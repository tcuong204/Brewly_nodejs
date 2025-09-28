import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProductsByKeyword,
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/search/:keyword", searchProductsByKeyword);
router.get("/:id", getProductById);
export default router;
