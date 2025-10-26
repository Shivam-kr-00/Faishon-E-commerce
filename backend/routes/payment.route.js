import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRazorpayOrder, verifyRazorpayPayment, getUserOrders } from '../controllers/payment.controller.js';
const router = express.Router();

router.post("/create-checkout-session", protectRoute, createRazorpayOrder);
router.post("/checkout-success", protectRoute, verifyRazorpayPayment);
router.get("/user-orders", protectRoute, getUserOrders);


export default router;