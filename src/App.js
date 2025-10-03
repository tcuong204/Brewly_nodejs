import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import imageRoutes from "./routes/image.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import otpRoutes from "./routes/otp.routes.js ";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// Routes
app.use("/api", otpRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/cart", cartRoutes);
app.use("/uploads", express.static("uploads"));
export default app;
