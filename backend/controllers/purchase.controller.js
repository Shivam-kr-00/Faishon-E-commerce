import Product from "../models/product.model.js";

export const getNewArrivals = async (req, res) => {
    try {
        // Get products created in the last 30 days, sorted by creation date
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const products = await Product.find({
            createdAt: { $gte: thirtyDaysAgo }
        })
            .sort({ createdAt: -1 })
            .limit(12);

        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getNewArrivals Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFeaturedPurchases = async (req, res) => {
    try {
        // Get featured products with the most orders
        const products = await Product.find({ isFeatured: true })
            .sort({ orderCount: -1 })
            .limit(12);

        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getFeaturedPurchases Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getOfferPurchases = async (req, res) => {
    try {
        // Get products that have a discount or are part of an active offer
        const products = await Product.find({
            $or: [
                { discountPercentage: { $gt: 0 } },
                { isOnSale: true }
            ]
        })
            .sort({ discountPercentage: -1 })
            .limit(12);

        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getOfferPurchases Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};