import Admin from "../models/Admin.js";
import { signToken } from "../middleware/auth.js";

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    const admin = await Admin.findOne({ email: (email || "").toLowerCase() }).select("+password");
    const ok = admin && (await admin.comparePassword(password || ""));
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Invalid admin credentials" });
    }
    const token = signToken({ id: admin._id, role: "admin" });
    res.json({
      success: true,
      data: { admin: { id: admin._id, email: admin.email }, token },
      message: "Admin logged in successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
}
