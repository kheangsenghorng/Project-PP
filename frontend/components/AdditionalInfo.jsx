"use client";

import React, { useEffect, useState } from "react";
import { Trash2, GripVertical, Pencil, Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useInfoItemStore } from "@/store/useInfoItemStore";

export default function AdditionalInfo() {
  const { id, bookingtourId } = useParams();
  const tourId = bookingtourId || id;

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [newText, setNewText] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const {
    infoItems,
    loading,
    error,
    fetchInfoItems,
    createInfoItem,
    updateInfoItem,
    deleteInfoItem,
  } = useInfoItemStore();

  useEffect(() => {
    if (tourId) fetchInfoItems(tourId);
  }, [tourId]);

  const handleDelete = async (itemId) => {
    await deleteInfoItem(itemId);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(infoItems[index].text);
  };

  const handleSaveEdit = async (itemId) => {
    await updateInfoItem(itemId, editText);
    setEditIndex(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  const handleCreate = async () => {
    if (newText.trim()) {
      await createInfoItem(tourId, newText);
      setNewText("");
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setNewText("");
    setIsCreating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Additional Info</h3>
        <Pencil
          className="w-4 h-4 text-gray-500 cursor-pointer"
          onClick={() => setIsCreating(true)}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-sm text-gray-500 mb-2">Loading info items...</div>
      )}

      {/* Error State */}
      {error && <div className="text-sm text-red-500 mb-2">Error: {error}</div>}

      {/* Info Items */}
      <div className="space-y-3">
        {infoItems.slice(0, visibleCount).map((item, index) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-gray-50 rounded-md p-3"
          >
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="text-sm text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full mr-4"
              />
            ) : (
              <span className="text-sm text-gray-700">{item.text}</span>
            )}

            <div className="flex items-center space-x-2 ml-4">
              {editIndex === index ? (
                <>
                  <Check
                    className="w-4 h-4 text-green-500 cursor-pointer"
                    onClick={() => handleSaveEdit(item._id)}
                  />
                  <X
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
                    onClick={handleCancelEdit}
                  />
                </>
              ) : (
                <>
                  <Pencil
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500"
                    onClick={() => handleEdit(index)}
                  />
                  <Trash2
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
                    onClick={() => handleDelete(item._id)}
                  />
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                </>
              )}
            </div>
          </div>
        ))}

        {/* Create New Item Form */}
        {isCreating && (
          <div className="flex items-center justify-between bg-gray-50 rounded-md p-3">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter new info"
              className="text-sm text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full mr-4"
            />
            <div className="flex items-center space-x-2 ml-4">
              <Check
                className="w-4 h-4 text-green-500 cursor-pointer"
                onClick={handleCreate}
              />
              <X
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
                onClick={handleCancelCreate}
              />
            </div>
          </div>
        )}
        {visibleCount < infoItems.length && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="text-sm text-blue-600 hover:underline"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
