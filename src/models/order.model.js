import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // Nếu khách đã đăng nhập thì có userId
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  // Nếu khách là guest thì lưu email, tên, số điện thoại
  guestEmail: { type: String },
  guestPhone: { type: String },
  guestName: { type: String },

  shippingAddress: { type: String, required: true },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],

  totalAmount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
