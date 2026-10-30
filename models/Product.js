import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4.0 },
    image: { type: String, required: true, trim: true },
    gallery: { type: [String], default: [] },
    category: { type: String, default: "Casual", trim: true },
    stock: { type: Number, min: 0, default: 10 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
