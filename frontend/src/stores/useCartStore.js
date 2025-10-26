import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getMyCoupon: async () => {
        try {
            const res = await axios.get("/coupons");
            set({ coupon: res.data });
        } catch (error) {
            console.error("Error in fetching coupon :", error);
        }
    },

    applyCoupon: async (code) => {
        try {
            const res = await axios.post("/coupons/validate", { code });
            set({ coupon: res.data, isCouponApplied: true });
            get().calculateTotals();
            toast.success("Coupon Applied Successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
        }
    },

    removeCoupon: async () => {
        try {
            set({ coupon: null, isCouponApplied: false });
            get().calculateTotals();
            toast.success("Coupon Removed");
        } catch (error) {
            console.error("Error in removing coupon", error);
        }
    },

    getCartItems: async () => {
        try {
            const res = await axios.get('/cart');
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response?.data?.message || "An error occurred while fetching cart items");
        }
    },
    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },

    addToCart: async (product) => {
        try {
            await axios.post('/cart', { productId: product._id });
            toast.success("Product added to cart");

            set(prevState => {
                const exisitingItem = prevState.cart.find(item => item._id.toString() === product._id.toString());
                const newCart = exisitingItem
                    ? prevState.cart.map(item =>
                        item._id.toString() === product._id.toString() ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });

            get().calculateTotals();
        } catch (error) {
            if (error.response?.status === 401 || error.response?.data?.message === "No token provided") {
                toast.error("Please login to add product to cart");
            } else {
                toast.error(error.response?.data?.message || "An error occurred while adding product to cart");
            }
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete(`/cart`, { data: { productId } });

            set(prevState => ({
                cart: prevState.cart.filter(item => item._id.toString() !== productId.toString())
            }));

            get().calculateTotals();
            toast.success("Product removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove product");
        }
    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) return get().removeFromCart(productId);

        try {
            await axios.put(`/cart/${productId}`, { quantity });

            set(prevState => ({
                cart: prevState.cart.map(item =>
                    item._id.toString() === productId.toString() ? { ...item, quantity } : item
                )
            }));

            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let total = subtotal;
        if (coupon && get().isCouponApplied) {
            // Support both `discount` and `discountPercentage` fields and coerce to Number
            const rawDiscount = coupon.discount ?? coupon.discountPercentage ?? 0;
            const discountPct = Number(rawDiscount);
            const validDiscount = isFinite(discountPct) && discountPct > 0 ? discountPct : 0;
            const discount = subtotal * (validDiscount / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },
}));
