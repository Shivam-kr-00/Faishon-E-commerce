import React, { useEffect } from "react";
import CategoryItem from "./CategoryItem";
import SlideShow from "../components/SlideShow";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";
import SearchBar from "../components/SearchBar";
import { motion } from "framer-motion";
import { Truck, RefreshCw, ShieldCheck } from "lucide-react";

import { IMAGES } from "../config/imageConfig";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: IMAGES.categories.jeans },
  { href: "/t-shirts", name: "T-shirts", imageUrl: IMAGES.categories.tshirts },
  { href: "/shoes", name: "Shoes", imageUrl: IMAGES.categories.shoes },
  { href: "/glasses", name: "Glasses", imageUrl: IMAGES.categories.glasses },
  { href: "/jackets", name: "Jackets", imageUrl: IMAGES.categories.jackets },
  { href: "/suits", name: "Suits", imageUrl: IMAGES.categories.suits },
  { href: "/bags", name: "Bags", imageUrl: IMAGES.categories.bags },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <>
      <SearchBar categories={categories} />
      <SlideShow />

      <div className="relative bg-gradient-to-br from-emerald-900 via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-700 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
              >
                Elevate Your Style — Timeless, Sustainable Fashion
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-lg text-amber-100 max-w-2xl mb-8"
              >
                Discover curated collections crafted with care. Premium
                materials, ethical production, and designs made to last.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/collections/featured"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-6 py-3 text-black font-semibold shadow-lg hover:bg-emerald-300 transition"
                >
                  Shop Featured
                </a>
                <a
                  href="/collections/new"
                  className="inline-flex items-center justify-center rounded-md border border-emerald-300 px-6 py-3 text-emerald-200 hover:bg-white/5 transition"
                >
                  New Arrivals
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-tr from-white/5 to-white/3 border border-white/5"
              >
                <div
                  className="w-full h-64 sm:h-80 md:h-96 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${IMAGES.hero}')`,
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo strip */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            Free shipping on orders over ₹1999 • 30-day returns • Secure
            payments
          </p>
          <a
            href="/offers"
            className="text-black bg-amber-300 px-4 py-2 rounded-md font-semibold"
          >
            Limited Time Offers
          </a>
        </div>
      </div>

      {/* Categories + Features */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center text-3xl sm:text-4xl font-bold mb-6">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            {categories.map((category, idx) => (
              <motion.div
                key={category.name}
                className="transform transition-transform duration-300"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.04,
                  type: "spring",
                  stiffness: 140,
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <CategoryItem category={category} />
              </motion.div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={Truck}
              title="Fast & Free Delivery"
              desc="On orders ₹1999+ across India"
            />
            <FeatureCard
              icon={RefreshCw}
              title="30-Day Returns"
              desc="Hassle-free returns and exchanges"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Payments"
              desc="Trusted payment gateways & encryption"
            />
          </div>

          {!isLoading && products.length > 0 && (
            <>
              <h2 className="text-center text-4xl font-semibold text-emerald-400 mt-16 mb-6">
                Featured Products
              </h2>

              <div>
                <FeaturedProducts featuredProducts={products} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="bg-gray-800/60 rounded-lg p-6 flex items-start gap-4 border border-white/5"
  >
    <div className="p-3 rounded-md bg-emerald-600/20 text-emerald-300">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-white font-semibold">{title}</h4>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  </motion.div>
);

export default HomePage;
