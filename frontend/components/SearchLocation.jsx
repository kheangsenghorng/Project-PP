"use client";
import React, { useEffect, useState } from "react";
import { useTourStore } from "@/store/tourStore";

const destinations = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kampot",
  "Sihanoukville",
  "Koh Kong",
  "Takeo",
  "Kampong Cham",
  "Kampong Thom",
  "Kampong Speu",
  "Kampong Chhnang",
  "Prey Veng",
  "Svay Rieng",
  "Banteay Meanchey",
  "Pailin",
  "Pursat",
  "Kratie",
  "Stung Treng",
  "Ratanakiri",
  "Mondulkiri",
  "Oddar Meanchey",
  "Kep",
  "Tbong Khmum",
  "Preah Vihear",
];

const SearchLocation = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [duration, setDuration] = useState("");
  const {
    filterToursByPrice,
    filterToursByDuration,
    filterToursByLocation, // Optional if you have this in your store
    isLoading,
    error,
  } = useTourStore();

  useEffect(() => {
    if (duration) {
      const parsedDuration = parseInt(duration);
      if (!isNaN(parsedDuration)) {
        filterToursByDuration(parsedDuration);
      }
    }
  }, [duration, filterToursByDuration]);

  useEffect(() => {
    if (selectedDestination && typeof filterToursByLocation === "function") {
      filterToursByLocation(selectedDestination);
    }
  }, [selectedDestination, filterToursByLocation]);

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Search</h2>

      {/* Destination Filter */}
      <div className="mb-4">
        <label className="block mb-2">Destination</label>
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose Location</option>
          {destinations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Filter */}
      <div className="mb-4">
        <label className="block mb-2">Duration (days)</label>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter number of days (e.g., 5)"
        />
      </div>
    </div>
  );
};

export default SearchLocation;
