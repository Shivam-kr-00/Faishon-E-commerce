import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useEffect } from "react";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, applyCoupon, removeCoupon, getMyCoupon } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    // Logic to apply the coupon code
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="Voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Do you have a gift voucher or coupon?
          </label>
          <input
            type="text"
            id="Voucher"
            className="w-full rounded-lg text-white border-gray-600 text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-700
            p-2.5 shadow-sm"
            placeholder="Enter Your Code"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>
        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-lg
        bg-emerald-500 px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleApplyCoupon}
        >
          Apply Code
        </motion.button>
      </div>

      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Coupon Applied</h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage} % off
          </p>
          <motion.button
            type="button"
            className="flex w-full items-center justify-center rounded-lg
        bg-red-500 px-5 py-2.5 text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300 ">
            Your Availabe Coupon :
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage} % off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
