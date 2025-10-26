import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/product.controller.js';
import { adminROute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Define your product-related routes here

router.get("/", protectRoute, adminROute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protectRoute, adminROute, createProduct);
router.get("/recommendations", getRecommendedProducts);
router.delete("/:id", protectRoute, adminROute, deleteProduct);
router.get("/category/:category", getProductByCategory);
router.patch("/:id", protectRoute, adminROute, toggleFeaturedProduct);
export default router;

