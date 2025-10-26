import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const OrderSummary = () => {
  const { cart, total, subtotal, coupon, isCouponApplied, getCartItems } =
    useCartStore();
  const navigate = useNavigate();
  const savings = subtotal - total;

  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  // ✅ Razorpay checkout handler
  const handlePayment = async () => {
    try {
      // Prepare products array
      const products = cart.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const couponCode = coupon?.code || "";

      // 1. Create Razorpay order on backend
      const { data } = await axios.post("/payments/create-checkout-session", {
        products,
        couponCode,
      });

      const { order } = data;

      // 2. Define Razorpay options
      const options = {
        key: "rzp_test_RH9infdiyGoQSq", // your test key
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop Name",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data } = await axios.post(
              "/payments/checkout-success",
              response
            );
            // Refresh cart from server (server clears it on success)
            await getCartItems();
            // If backend returned a redirectUrl, navigate to it
            if (data?.redirectUrl) {
              try {
                const url = new URL(data.redirectUrl);
                navigate(url.pathname + url.search);
                return;
              } catch (err) {
                // fallback: navigate to a relative path
                navigate("/purchase-success");
                return;
              }
            }
            // Fallback navigation if no redirectUrl
            alert("Payment Verified!");
            navigate("/purchase-success");
          } catch (err) {
            console.error("Verification error:", err);
            alert(
              "Payment verified but failed to complete server-side processing."
            );
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#10B981",
        },
      };

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong with the payment process");
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order Summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original Price
            </dt>
            <dd className="text-base font-medium text-white">
              ₹{formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -₹{formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ₹{formattedTotal}
            </dd>
          </dl>

          <motion.button
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}
          >
            Proceed to Checkout
          </motion.button>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-normal text-gray-400">or</span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
            >
              Continue shopping
              <MoveRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
