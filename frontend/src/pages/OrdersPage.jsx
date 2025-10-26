import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";

const OrdersPage = () => {
  const { orders, ordersLoading, orderError, fetchOrders } = useUserStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{orderError}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No orders found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-emerald-400 text-center">
          Order History
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Track and manage your purchases
        </p>

        <div className="space-y-8 max-w-4xl mx-auto">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 rounded-xl shadow-lg p-6 border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-700">
                <div className="space-y-1">
                  <p className="text-emerald-400 font-medium">
                    Order #
                    {(order.razorpayPaymentId || order._id?.toString() || "N/A")
                      .slice(-8)
                      .toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-emerald-900/30 rounded-lg">
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative group">
                        <img
                          src={
                            item.product?.image ||
                            "https://placehold.co/64x64?text=Product"
                          }
                          alt={item.product?.name || "Product"}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-700 group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/64x64?text=Product";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200 hover:text-emerald-400 transition-colors duration-200">
                          {item.product?.name || "Product Unavailable"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Quantity: {item.quantity || 0}
                        </p>
                      </div>
                    </div>
                    <div className="text-right mt-4 sm:mt-0 ml-20 sm:ml-0">
                      <p className="font-medium text-emerald-400">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Per item: ₹{(item.price / item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
