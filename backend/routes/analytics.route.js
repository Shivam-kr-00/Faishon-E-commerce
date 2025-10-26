import express from 'express';
import { adminROute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/", protectRoute, adminROute, async (req, res) => {

    try {
        // get overall analytics
        const analyticsData = await getAnalyticsData();

        // seven day period analytics
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        // fetch daily sales between start and end
        const dailySalesData = await getDailySalesData(startDate, endDate);

        // return a flattened response so frontend can read response.data.users etc.
        res.json({
            users: analyticsData.users,
            products: analyticsData.products,
            totalSales: analyticsData.totalSales,
            totalRevenue: analyticsData.totalRevenue,
            dailySalesData,
        });
    } catch (error) {
        console.log("Error in analytics Route", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }
});

export default router;