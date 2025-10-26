// src/components/CategoryItem.jsx

import React from "react";
import { Link } from "react-router-dom"; // Assuming you use react-router-dom for navigation
import { ArrowRight } from "lucide-react";

const CategoryItem = ({ category }) => {
  return (
    <Link to={"/category" + category.href} className="block group">
      {/* The main container. 
        - `group` is used to control child element styles on hover.
        - `aspect-square md:aspect-[4/5]` makes it responsive: square on mobile, taller on desktop.
      */}
      <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-lg">
        {/* The background image with a subtle zoom effect on hover */}
        <img
          src={category.imageUrl}
          alt={`View collection for ${category.name}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        />

        {/* A dark gradient overlay from the bottom up.
          This ensures the text on top is always readable, even on bright images.
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* The text content, positioned at the bottom */}
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#D8C7B9]">
            {category.name}
          </h3>

          {/* A "Shop Now" link that appears on hover for a stronger call-to-action */}
          <div className="flex items-center  mt-2 text-white/80 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-sm font-semibold tracking-wider">
              SHOP NOW
            </span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryItem;
