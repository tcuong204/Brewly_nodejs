import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: { type: Number, required: true },
  options: Object,
});

const orderSchema = new mongoose.Schema(
  {
    userName: String,
    phone: String,
    address: String,
    items: [orderItemSchema],
    total: Number,
    status: {
      type: String,
      enum: ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
