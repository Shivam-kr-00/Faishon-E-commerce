import Coupon from "../models/coupon.model.js";
export const getCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }

}

export const validateCoupons = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        if (coupon.expirationDate < new Date) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon Expired" });
        }
        res.json({
            message: "Coupon is Valid",
            code: coupon.code,
            discountPercentage: coupon.discount || coupon.discountPercentage
        });

    } catch (error) {
        console.log("Error in ValidateCoupons", error.message);
        res.status(500).json({ message: "Internal Server Errror", error: error.message })

    }
}

export const createCoupon = async (req, res) => {
    try {
        const { userId, discount, expirationDays } = req.body;

        if (!userId || !discount || !expirationDays) {
            return res.status(400).json({ message: "userId, discount, and expirationDays are required." });
        }

        // Generate a unique coupon code
        const couponCode = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();

        // Calculate expiration date
        const expirationDate = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

        // Create new coupon
        const newCoupon = new Coupon({
            code: couponCode,
            discountPercentage: discount,

            expirationDate,
            userId,
        });

        await newCoupon.save();

        res.status(201).json({
            success: true,
            message: "Coupon created successfully.",
            coupon: newCoupon,
        });
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ success: false, message: "Error creating coupon", error: error.message });
    }
};


// ✅ Get all coupons 
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().populate("userId", "name email");
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ success: false, message: "Error fetching coupons" });
    }
};


// ✅ Deactivate or delete a coupon
export const deactivateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOneAndUpdate(
            { code },
            { isActive: false },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }

        res.status(200).json({ success: true, message: "Coupon deactivated.", coupon });
    } catch (error) {
        console.error("Error deactivating coupon:", error);
        res.status(500).json({ success: false, message: "Error deactivating coupon" });
    }
};