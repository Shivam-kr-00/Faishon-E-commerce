import Product from "../models/product.model.js";

// ✅ Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "User not found in request" });
        }

        // Ensure cartItems is initialized
        if (!Array.isArray(user.cartItems)) {
            user.cartItems = [];
        }

        // Check if product already exists in cart
        const existingItem = user.cartItems.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ productId, quantity: 1 });
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: user.cartItems,
        });
    } catch (error) {
        console.error("Error in addToCart Controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// ✅ Remove All / One Product from Cart
export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "User not found in request" });
        }

        if (!productId) {
            // If productId is not provided, remove everything
            user.cartItems = [];
        } else {
            // Remove only the matching product
            user.cartItems = user.cartItems.filter(
                (item) => item.productId.toString() !== productId
            );
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: productId ? "Product removed from cart" : "All items removed from cart",
            cart: user.cartItems,
        });
    } catch (error) {
        console.error("Error in removeAllFromCart Controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// ✅ Update Quantity
export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "User not found in request" });
        }

        const existingItem = user.cartItems.find(
            (item) => item.productId.toString() === productId
        );

        if (!existingItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (quantity === 0) {
            // Remove product if quantity becomes 0
            user.cartItems = user.cartItems.filter(
                (item) => item.productId.toString() !== productId
            );
        } else {
            // Update product quantity
            existingItem.quantity = quantity;
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: user.cartItems,
        });
    } catch (error) {
        console.error("Error in updateQuantity Controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// ✅ Get Cart Products with Details
export const getCartProducts = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "User not found in request" });
        }

        if (!Array.isArray(user.cartItems) || user.cartItems.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch product details for items in the cart
        const productIds = user.cartItems.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        // Merge product details with quantity info
        const cartItems = products.map((product) => {
            const item = user.cartItems.find(
                (cartItem) => cartItem.productId.toString() === product._id.toString()
            );
            return { ...product.toJSON(), quantity: item.quantity };
        });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error in getCartProducts Controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
