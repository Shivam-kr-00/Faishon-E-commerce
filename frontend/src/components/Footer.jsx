// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">About Us</h2>
          <p className="text-gray-400 text-sm">
            Premium e-commerce store offering the best products and deals. Shop
            with confidence and style.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Quick Links</h2>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Contact</h2>
          <p className="text-gray-400 text-sm">Email: shivam082524@gmail.com</p>
          <p className="text-gray-400 text-sm">Phone: +91 8252412598</p>
          <p className="text-gray-400 text-sm">Patna , Bihar, India</p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Premium Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
