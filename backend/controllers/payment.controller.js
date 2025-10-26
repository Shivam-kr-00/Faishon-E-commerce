import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import instance from "../lib/razor.js"; // Your configured Razorpay instance
import crypto from "crypto";



// This replaces Stripe's 'createCheckoutSession'
export const createRazorpayOrder = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        const userId = req.user._id;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        // 1. Calculate the initial total amount (in paise)
        let totalAmount = 0;
        const invalidProducts = [];
        const debugProducts = [];
        for (const product of products) {
            // Defensive checks: ensure price and quantity exist and are numbers
            const rawPrice = Number(product.price);
            // Safer quantity coercion: if quantity is missing or invalid, default to 1
            let quantity = Number(product.quantity);
            if (!isFinite(quantity) || quantity <= 0) {
                quantity = 1;
            }

            debugProducts.push({ id: product._id || product.id, price: product.price, quantity: product.quantity });

            if (!isFinite(rawPrice) || rawPrice <= 0) {
                invalidProducts.push({ id: product._id || product.id, price: product.price });
                console.warn(`Skipping product with invalid price: ${JSON.stringify(product)}`);
                continue;
            }

            const priceInPaise = Math.round(rawPrice * 100); // Convert to smallest currency unit (paise)
            totalAmount += priceInPaise * Math.max(1, Math.floor(quantity));
        }

        console.info("Products received for checkout:", debugProducts);
        if (invalidProducts.length) {
            console.warn("Products with invalid prices detected:", invalidProducts);
        }

        // 2. Apply coupon discount BEFORE creating the order
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, userId: userId, isActive: true });
            if (coupon) {
                // coupon model uses `discount` field; support legacy `discountPercentage` if present
                const rawDiscountPct = coupon.discountPercentage ?? coupon.discount ?? 0;
                const discountPct = Number(rawDiscountPct);
                if (!isFinite(discountPct) || discountPct <= 0) {
                    console.warn(`Ignoring invalid coupon discount percent: ${rawDiscountPct}`);
                } else {
                    const discount = (totalAmount * discountPct) / 100;
                    totalAmount -= Math.round(discount);
                    console.info(`Applied coupon ${coupon.code} with ${discountPct}% => discount(paise):`, Math.round(discount));
                }
            }
        }

        const finalAmount = Math.round(totalAmount); // already in paise

        // Log computed amounts and options to help debug Razorpay errors
        console.info("Computed totalAmount (paise):", totalAmount);

        // If finalAmount is not a finite number, return a clear error instead of sending NaN to Razorpay
        if (!isFinite(finalAmount)) {
            console.error("Computed totalAmount is invalid (NaN). Debug products:", debugProducts);
            return res.status(400).json({ message: "Invalid product data resulted in NaN total. Check product prices/quantities.", debugProducts });
        }

        if (finalAmount <= 0) {
            return res.status(400).json({ message: "The total amount must be greater than zero." });
        }

        // 3. Prepare options for Razorpay Order
        const options = {
            amount: finalAmount,
            currency: "INR", // Razorpay typically uses INR for Indian merchants
            receipt: `receipt_order_${crypto.randomBytes(6).toString("hex")}`,
            // 'notes' is the equivalent of Stripe's 'metadata'. We store data here
            // to retrieve it later during verification.
            notes: {
                userId: userId.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        name: p.name, // Storing name can be helpful for receipts
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        };

        // 4. Create the order
        console.info("Razorpay order options:", options);
        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: "Error creating Razorpay order." });
        }

        // 5. Send the order details to the frontend
        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};


// This replaces Stripe's 'checkoutSuccess' webhook/handler
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId })
            .populate({
                path: 'products.product',
                // If product was deleted, ensure we still get partial order data
                options: { retainNullValues: true }
            })
            .sort({ createdAt: -1 }); // Most recent orders first

        // Clean up orders data to handle null products
        const cleanedOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.products = orderObj.products.map(item => ({
                ...item,
                // If product was deleted, provide default values
                product: item.product || {
                    name: 'Product Unavailable',
                    image: 'https://placehold.co/64x64?text=Product'
                }
            }));
            return orderObj;
        });

        res.status(200).json({ success: true, orders: cleanedOrders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details." });
        }

        // 1. Verify the signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZOR_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature. Payment verification failed." });
        }

        // 2. If signature is authentic, fetch order details to get our 'notes'
        const fetchedOrder = await instance.orders.fetch(razorpay_order_id);
        const { userId, couponCode, products: productsString } = fetchedOrder.notes;

        // At this point, the payment is CONFIRMED and LEGITIMATE.
        // Now we can safely update our database.

        // 3. Deactivate coupon if it was used
        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode, userId: userId },
                { isActive: false }
            );
        }

        // 4. Create a new Order in our database
        const products = JSON.parse(productsString);
        const newOrder = new Order({
            user: userId,
            products: products.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: fetchedOrder.amount / 100, // convert from paise to rupees
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            // populate legacy stripeSessionId with payment id to avoid duplicate-null unique index
            stripeSessionId: razorpay_payment_id,
        });
        await newOrder.save();

        // 5. Create a new coupon as a reward if the purchase was large
        // 20000 paise = ₹200
        if (fetchedOrder.amount >= 20000) {
            await createNewCoupon(userId);
        }

        // 6. Clear user's cart and return a JSON redirect URL (client will navigate)
        try {
            if (req.user) {
                req.user.cartItems = [];
                await req.user.save();
                console.info(`Cleared cart for user ${req.user._id}`);
            }
        } catch (err) {
            console.warn("Failed to clear user cart after payment:", err.message);
        }

        return res.status(200).json({ success: true, redirectUrl: `${process.env.CLIENT_URL}/purchase-success?reference=${razorpay_payment_id}` });

    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({ message: "Error processing payment verification", error: error.message });
    }
};

// This is your internal business logic, it does not need to change.
async function createNewCoupon(userId) {
    // Deleting the old coupon might not be desired, depends on requirements.
    // You might want to just create a new one without deleting.
    // await Coupon.findOneAndDelete({ userId, code: { $ne: "SOME_STATIC_COUPON" } });

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        // `discount` is required by the schema. Keep `discountPercentage` for compatibility.
        discount: 10,
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    });
    await newCoupon.save();
    return newCoupon;
}

