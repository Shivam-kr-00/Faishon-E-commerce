import React, { useState, useEffect } from "react";

import { IMAGES } from "../config/imageConfig";
function SlideShow() {
  const Slides = [
    { image: IMAGES.slideshow[0], text: "New Collection" },
    { image: IMAGES.slideshow[1], text: "Summer Sale" },
    { image: IMAGES.slideshow[2], text: "Trending Now" },
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % Slides.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + Slides.length) % Slides.length);
  };

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  return (
    <div className="relative w-full mx-auto h-[400px] overflow-hidden rounded-2xl shadow-lg">
      {/* Slides */}
      {Slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-opacity duration-700 ease-in-out ${
            index === slideIndex ? "opacity-100" : "opacity-0"
          } absolute inset-0`}
        >
          <img
            src={slide.image}
            alt={slide.text}
            className="w-full h-full object-cover  rounded-2xl"
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/70 rounded-full p-3"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/70 rounded-full p-3"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {Slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full ${
              index === slideIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default SlideShow;
