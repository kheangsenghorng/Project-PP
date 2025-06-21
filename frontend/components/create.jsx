import React from "react";
import { FiPlus } from "react-icons/fi";

export default function CategoryPopup({
  isOpen,
  onClose,
  onSubmit,
  value,
  setValue,
  isEditing,
  type = "Category",
}) {
  if (!isOpen) return null;
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiPlus />{" "}
          {isEditing ? `Edit ${capitalizedType}` : `Add New ${capitalizedType}`}
        </h2>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${type.toLowerCase()} name`}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-[#1570EF] text-white hover:bg-[#125ecf]"
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
