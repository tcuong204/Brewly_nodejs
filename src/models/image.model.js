import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
