import Order from "../models/Order.js";

const DELIVERY_FEE = 15;
const DISCOUNT_PERCENT = 20;

export async function createOrder(req, res) {
  try {
    const { items, customerInfo, paymentMethod } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Order must contain at least one item",
      });
    }
    if (!customerInfo || !customerInfo.fullName || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "customerInfo.fullName and customerInfo.email are required",
      });
    }

    // Server par total recompute karo (client-supplied total trust nahi karte)
    const subtotal = items.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );
    const total = subtotal - (subtotal * DISCOUNT_PERCENT) / 100 + DELIVERY_FEE;

    const order = await Order.create({
      items,
      customerInfo,
      paymentMethod: paymentMethod === "card" ? "card" : "cod",
      total,
      user: req.user && req.user._id ? req.user._id : null,
    });

    res.status(201).json({ success: true, data: order, message: "Order placed successfully" });
  } catch (err) {
    const validation = err.name === "ValidationError";
    res.status(validation ? 400 : 500).json({
      success: false,
      data: null,
      message: validation ? Object.values(err.errors).map(e => e.message).join(", ") : err.message,
    });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.productId", "title price");
    res.json({
      success: true,
      data: orders,
      meta: { total: orders.length },
      message: "Orders fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
}
