import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verify(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new Error("No token provided");
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error("Invalid or expired token");
  }
}

export async function protect(req, res, next) {
  try {
    const decoded = verify(req);
    const user = await User.findById(decoded.id).select("name email");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

export function protectAdmin(req, res, next) {
  try {
    const decoded = verify(req);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

export function protectAny(req, res, next) {
  try {
    const decoded = verify(req);
    if (decoded.role === "admin") {
      req.user = { _id: decoded.id, role: "admin" };
    } else {
      req.user = { _id: decoded.id, role: "user" };
    }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}
