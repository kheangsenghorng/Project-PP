"use client"; // Required for React Server Components in Next.js

import React from "react";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Log rendering for debugging
  console.log("Pagination rendered");

  // Prevent rendering if totalPages is less than or equal to 1
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-4 p-2">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className={`w-10 h-10 flex items-center justify-center rounded-full border ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:bg-gray-200"
        }`}
      >
        ←
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            className={`w-10 h-10 flex items-center justify-center rounded-full border ${
              currentPage === page
                ? "bg-gray-800 text-white"
                : "text-black hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className={`w-10 h-10 flex items-center justify-center rounded-full border ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:bg-gray-200"
        }`}
      >
        →
      </button>
    </div>
  );
};

// Default Props
Pagination.defaultProps = {
  currentPage: 1,
  totalPages: 1,
  onPageChange: () => {},
};

// Prop Type Validation
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
