"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const UploadComponent = () => {
  const adminId = "67de72f231d88e554449c81b";
  const tourId = "680c6745e535c9fb3eb8cd11";
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch existing images when the component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/files/admin/${adminId}/tour/${tourId}`
        );
        setUploadedImages(response.data.galleryUrl || []);
      } catch (error) {
        console.error("Error fetching images:", error);
        setMessage("Failed to load images.");
      }
    };

    fetchImages();
  }, [tourId, adminId]); // Runs when component mounts

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `http://localhost:4000/api/files/admin/${adminId}/upload/${tourId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message || "Files uploaded successfully!");
      setUploadedImages(response.data.galleryUrl); // Update with new images
      setFiles([]); // Clear selected files after upload
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error uploading files. Please try again."
      );
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-2 border p-2 rounded"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
      <div className="mt-4 flex flex-wrap">
        {uploadedImages.length > 0 ? (
          uploadedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Uploaded"
              className="w-32 h-32 object-cover m-2 rounded border"
            />
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UploadComponent;
