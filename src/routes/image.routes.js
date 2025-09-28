import express from "express";
import upload from "../middleware/upload.js";
import { uploadImages, getImage } from "../controller/image.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 30), uploadImages); // Cho phép tối đa 5 ảnh
router.get("/:id", getImage);

export default router;
