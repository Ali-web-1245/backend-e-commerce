import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: .env ke ALLOWED_ORIGINS (comma-separated) se multiple origins allow
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Postman / server-to-server requests me origin missing hota hai — allow
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "E-commerce API running 🚀" });
});

app.use("/api/products", (await import("./routes/productRoutes.js")).default);
app.use("/api/orders", (await import("./routes/orderRoutes.js")).default);
app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/admin", (await import("./routes/adminRoutes.js")).default);

app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ success: false, data: null, message: err.message || "Server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
    if (allowedOrigins.length > 0) console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
  });
});
