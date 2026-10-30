import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: { type: String, required: true },
  image: { type: String, default: "" },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const customerInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: "" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], required: true, validate: v => v.length > 0 },
    customerInfo: { type: customerInfoSchema, required: true },
    paymentMethod: { type: String, enum: ["card", "cod"], default: "cod" },
    total: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
