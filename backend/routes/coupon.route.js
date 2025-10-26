import express from "express";
import { createCoupon, deactivateCoupon, getAllCoupons, getCoupons, validateCoupons } from "../controllers/coupon.controller.js";
import { protectRoute, adminROute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCoupons);
router.post("/validate", protectRoute, validateCoupons);


// ✅ Only admin can access

router.post("/create", protectRoute, adminROute, createCoupon);
router.get("/all", protectRoute, adminROute, getAllCoupons);
router.put("/deactivate/:code", protectRoute, adminROute, deactivateCoupon);
export default router;