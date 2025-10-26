import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader, LogIn } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
// ...existing code...

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login({ email, password });
  };

  return (
    // CHANGED: Set the main background to your brand's "Emerald Velvet" gradient
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d2e29] bg-[radial-gradient(circle_at_center,#15423b,#0d2e29_70%)] space-y-8 px-4">
      {/* First animated container: Heading */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full"
      >
        {/* CHANGED: Swapped gray text for your brand's champagne accent color */}
        <h1 className="text-[#D8C7B9] text-3xl font-bold tracking-wider text-center mt-16">
          Login to Your Account
        </h1>
      </motion.div>

      {/* Second animated container: Form */}
      <motion.div
        // CHANGED: Replaced gray background with a modern "frosted glass" effect
        className="w-full max-w-md bg-[#15423b]/50 backdrop-blur-xl p-6 rounded-lg shadow-2xl border border-white/10 "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}

          <div>
            <label
              htmlFor="email"
              // CHANGED: Label text color to a soft, readable white
              className="block text-sm font-medium text-white/70 mb-1"
            >
              Email *
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* CHANGED: Icon color to a subtle white */}
                <Mail className="h-5 w-5 text-white/50" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // CHANGED: Fully restyled the input field for a dark, premium theme
                className="block w-full py-2.5 pl-10 bg-black/20 text-white placeholder:text-white/40 border border-white/20 rounded-md 
                           focus:outline-none focus:border-[#D8C7B9] focus:ring-1 focus:ring-[#D8C7B9]/50 transition-all duration-300"
                placeholder="john@email.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              // CHANGED: Label text color to a soft, readable white
              className="block text-sm font-medium text-white/70 mb-1"
            >
              Password *
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* CHANGED: Icon color to a subtle white */}
                <Lock className="h-5 w-5 text-white/50" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // CHANGED: Fully restyled the input field for a dark, premium theme
                className="block w-full py-2.5 pl-10 bg-black/20 text-white placeholder:text-white/40 border border-white/20 rounded-md 
                           focus:outline-none focus:border-[#D8C7B9] focus:ring-1 focus:ring-[#D8C7B9]/50 transition-all duration-300"
                placeholder="******"
              />
            </div>
          </div>

          {/* Additional fields can be added here */}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent
          rounded-md shadow-sm text-white bg-emerald-600 
          hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
          focus-ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader
                  className="mr-2 h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5 " aria-hidden="true" />
                Login
              </>
            )}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400">
          Did not have an accouunt ? {""}
          <Link
            to="/signup"
            className="font-medium text-emerald-400 hover:text-emerald-300"
          >
            SignUp here <ArrowRight className="inline h-4 w-4 " />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
