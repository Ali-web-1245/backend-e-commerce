import { Router } from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createOrder);
router.get("/", protectAdmin, getOrders);

export default router;
