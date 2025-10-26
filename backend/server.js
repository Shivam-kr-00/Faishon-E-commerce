import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import purchaseRoutes from './routes/purchase.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
// Middleware to parse cookies

dotenv.config();




const app = express();


const __dirname = path.resolve();


app.use(cookieParser());

app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/purchases", purchaseRoutes);
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    
    // Handle any requests that don't match the above
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}


app.listen(PORT, () => {
    console.log("Server is running http://localhost:" + PORT);
    connectDB();
});

