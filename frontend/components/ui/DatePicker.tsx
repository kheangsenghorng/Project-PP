// ui/DatePicker.js
import React from "react";

interface DatePickerProps {
  checkIn?: string;
  checkOut?: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ checkIn = "", checkOut = "", onCheckInChange, onCheckOutChange }) => {
  return (
    <div className="w-full">
      <small className="text-gray-500">Check-in & Check-out Dates</small>
      <div className="flex justify-between mt-2">
        <input
          type="date"
          aria-label="Check-in date"
          className="border border-gray-300 rounded-lg p-2 text-gray-800 w-[48%]"
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
        />
        <span className="mx-2 text-gray-500">to</span>
        <input
          type="date"
          aria-label="Check-out date"
          className="border border-gray-300 rounded-lg p-2 text-gray-800 w-[48%]"
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DatePicker;
