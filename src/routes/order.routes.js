import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/", createOrder);

// Lấy chi tiết đơn hàng theo id
router.get("/:id", getOrder);

// Lấy tất cả đơn hàng
router.get("/", getAllOrders);

// Cập nhật đơn hàng
router.put("/:id", updateOrder);

export default router;
