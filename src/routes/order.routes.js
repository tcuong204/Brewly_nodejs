import express from "express";
import { createOrder, getOrders } from "../controller/order.controller.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);

export default router;
