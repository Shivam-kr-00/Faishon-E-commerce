import express from "express";
import {
    getNewArrivals,
    getFeaturedPurchases,
    getOfferPurchases
} from "../controllers/purchase.controller.js";

const router = express.Router();


router.get("/new-arrivals", getNewArrivals);


router.get("/featured", getFeaturedPurchases);


router.get("/offers", getOfferPurchases);

export default router;
