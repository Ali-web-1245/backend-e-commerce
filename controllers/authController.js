import User from "../models/User.js";
import { protect, signToken } from "../middleware/auth.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "name, email aur password required hain",
      });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, data: null, message: "Email already registered" });
    }
    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id, role: "user" });
    res.status(201).json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
      message: "Registered successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, data: null, message: "email aur password required hain" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Invalid email or password" });
    }
    const token = signToken({ id: user._id, role: "user" });
    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
      message: "Logged in successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
}

export async function me(req, res) {
  res.json({ success: true, data: req.user, message: "Current user" });
}

export { protect };
