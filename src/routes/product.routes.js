import express from "express";
import {
  createProduct,
  deleteProductImage,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProductsByKeyword,
  uploadProductImages,
} from "../controller/product.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/search/:keyword", searchProductsByKeyword);
router.get("/:id", getProductById);
router.post(
  "/:productId/images",
  upload.array("images", 30),
  uploadProductImages
);
router.delete("/:productId/images/:imageUrl", deleteProductImage);
export default router;
