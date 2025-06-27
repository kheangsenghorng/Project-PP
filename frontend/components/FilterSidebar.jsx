"use client";

import { useTourStore } from "@/store/tourStore";
import React, { useEffect, useState } from "react";

const FilterSidebar = () => {
  const [participants, setParticipants] = useState(13);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const [accommodation, setAccommodation] = useState({
    ac: 0,
    heating: 0,
    dishwasher: 0,
    petsAllowed: 0,
    fitnessCenter: 0,
    airportTransfer: 0,
    transfer: 0,
    Spa: 0,
    Pool: 0,
    Roomtype: 0,
  });

  const [tourAvailability, setTourAvailability] = useState("all");
  const [travelType, setTravelType] = useState("all");

  const {
    filterToursByPrice,
    fetchToursByRating,
    ratingFilter,
    setRatingFilter,
    isLoading,
    error,
    tours,
    fetchToursByAccommodation,
    loading,
  } = useTourStore();

  // 🔧 Converts accommodation object to binary string like "10101010"
  const convertToBinaryString = (acc) => {
    return Object.values(acc)
      .map((val) => (val ? "1" : "0"))
      .slice(0, 10)
      .join("")
      .padEnd(10, "0");
  };

  const handlePriceChange = (type, value) => {
    const updatedRange = { ...priceRange, [type]: value };
    setPriceRange(updatedRange);

    const min = Number(updatedRange.min);
    const max = Number(updatedRange.max);
    if (!isNaN(min) && !isNaN(max)) {
      filterToursByPrice({ minPrice: min, maxPrice: max });
    }
  };

  const handleAccommodationChange = (e) => {
    setAccommodation({
      ...accommodation,
      [e.target.name]: e.target.checked ? 1 : 0,
    });
  };

  const handleRatingChange = (e) => {
    const rating = parseFloat(e.target.value);
    setRatingFilter(rating);
    fetchToursByRating(rating);
  };

  const handleAvailabilityChange = (e) => {
    setTourAvailability(e.target.value);
  };

  const handleTravelTypeChange = (e) => {
    setTravelType(e.target.value);
  };

  useEffect(() => {
    const binaryString = convertToBinaryString(accommodation);
    fetchToursByAccommodation(binaryString);
  }, [accommodation]);

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex flex-col justify-between gap-4">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="border rounded p-3"
            placeholder="Min"
          />
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="border rounded p-3"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Accommodation */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Accommodation</h3>
        {Object.keys(accommodation).map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              name={key}
              checked={accommodation[key] === 1}
              onChange={handleAccommodationChange}
              className="mr-2"
            />
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </label>
        ))}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Rating</h3>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="flex items-center mb-2">
            <input
              type="radio"
              value={star}
              checked={ratingFilter === star}
              onChange={handleRatingChange}
              className="mr-2"
            />
            {star} Star
          </label>
        ))}
      </div>

      {/* Availability and Travel Type (optional) */}
      {/* <div className="mb-4">
        <h3 className="font-semibold mb-2">Availability</h3>
        <select
          value={tourAvailability}
          onChange={handleAvailabilityChange}
          className="border rounded p-2 w-full"
        >
          <option value="all">All</option>
          <option value="available">Available Only</option>
          <option value="unavailable">Unavailable Only</option>
        </select>
      </div> */}

      {/* <div className="mb-4">
        <h3 className="font-semibold mb-2">Travel Type</h3>
        <select
          value={travelType}
          onChange={handleTravelTypeChange}
          className="border rounded p-2 w-full"
        >
          <option value="all">All</option>
          <option value="adventure">Adventure</option>   
          <option value="leisure">Leisure</option>
          <option value="cultural">Cultural</option>
        </select>
      </div> */}
    </div>
  );
};

export default FilterSidebar;
