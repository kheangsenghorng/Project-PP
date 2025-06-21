"use client";
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const BannerHotel = () => {
  return (
    // Banner Section
    <section className="banner-hotel my-10">
      <div className="container mx-auto px-4 max-w-screen-xl h-full">
        <div className="flex flex-col md:flex-row items-center bg-gray-100 rounded-lg py-5 px-5 md:px-10 h-full">
          {/* Left Image (Airplane) */}
          <div className="flex-shrink-0 mb-5 md:mb-0 md:mr-5 text-center">
            <img
              src="./image/image.gif" // Ensure this path is correct
              alt="Airplane"
              className="mx-auto w-[150px] sm:w-[200px] md:w-[250px]"
            />
          </div>

          {/* Jumbotron Text */}
          <div className="flex-grow text-center mt-5 md:mt-0">
            <h1 className="text-2xl md:text-5xl font-bold text-black">
              Travel With <span className="text-green-700">Us Tour</span>
            </h1>
            <p className="text-gray-700 mt-2 md:mt-4 text-lg md:text-center">
              When customers rent a hotel, we ensure they have a comfortable and
              convenient stay tailored to their travel needs, with amenities and
              services designed to enhance their overall travel experience.
            </p>
          </div>

          {/* Right Image (Traveler) */}
          <div className="flex-shrink-0 mt-5 md:mt-0 md:ml-5 text-center">
            <img
              src="./image/download (1).png" // Ensure this path is correct
              alt="Traveler"
              className="mx-auto w-[150px] sm:w-[200px] md:w-[250px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerHotel;
    