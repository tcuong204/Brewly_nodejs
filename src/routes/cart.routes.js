import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cart.controller.js";

const router = express.Router();

router.get("/:user", getCart);
router.post("/:user", addToCart);
router.put("/:user/:productId", updateCartItem);
router.delete("/:user/:productId", removeFromCart);
router.delete("/:user", clearCart);

export default router;
