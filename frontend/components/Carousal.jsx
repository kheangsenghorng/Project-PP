"use client";
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const images = [
  {
    src: "/image/banner2.jpg",
    title: "Explore the World",
    description: "Discover amazing places with us!",
  },
  {
    src: "/image/banner3.jpg",
    title: "Adventure Awaits",
    description: "Let us plan your dream trip!",
  },
  {
    src: "/image/banner1.avif",
    title: "Travel With Us",
    description: "Experience the journey of a lifetime.",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Full-Width Image */}
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].title}
        className="w-full h-full object-cover"
        onError={(e) => (e.target.src = "./image/default.jpg")}
      />

      {/* Title and Description */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center bg-opacity-50 p-5 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold">
          {images[currentIndex].title}
        </h2>
        <p className="text-lg md:text-xl">{images[currentIndex].description}</p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 text-white left-5 transform -translate-y-1/2 rounded-full p-3 shadow-md z-10 hover:bg-green-400 hover:text-white"
      >
        &#10094; {/* Left Arrow */}
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 text-white transform -translate-y-1/2 rounded-full p-3 shadow-md z-10 hover:bg-green-400 hover:text-white"
      >
        &#10095; {/* Right Arrow */}
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
