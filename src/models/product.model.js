import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    category: {
      type: String,
      enum: [
        "Cà phê Việt Nam",
        "Cà phê pha máy",
        "Cold Brew",
        "Cà phê đá xay",
        "Trà",
        "Macchiato",
        "Thức uống trái cây",
        "Hi-tea Healthy",
      ],
      required: true,
    },
    description: String,
    images: [{ type: String }], // Thay đổi từ image thành images
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
