"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTourStore } from "@/store/tourStore";
import { useItineraryStore } from "@/store/itinerariesStore";
import { useGalleryStore } from "@/store/useGalleryStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useCategoryStore } from "@/store/categoryStore";
import TourCreatorLoading from "@/components/tour-creator-loading";

import {
  Calendar,
  Clock,
  Trash2,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  MapPin,
  Tag,
  DollarSign,
  Users,
  ImageIcon,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function EditTourPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  const [formState, setFormState] = useState({
    tour_id: "",
    tour_name: "",
    description: "",
    price: "",
    start_location: "",
    first_destination: "",
    second_destination: "",
    startDate: "",
    endDate: "",
    status: "",
    overview: "",
    category: "",
    limit: "",
  });

  const [locationIds, setLocationIds] = useState({
    start_location: "",
    first_destination: "",
    second_destination: "",
  });
  const [activeField, setActiveField] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [count, setCount] = useState(1);
  const [itineraryList, setItineraryList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    start_location: false,
    first_destination: false,
    second_destination: false,
    category: false,
  });

  const {
    createTour,
    updateTour,
    exists,
    checkTourId,
    isChecking,
    gallery,
    loading,
    fetchGallery,
    fetchTour,
    tour,
  } = useTourStore();

  const {
    locations,
    fetchLocations,
    loading: locationsLoading,
    error: locationError,
  } = useLocationStore();

  const {
    categories,
    error: categoryError,
    loading: categoriesLoading,
    createCategory,
    fetchCategories,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const { fetchItinerariesByTourId, itineraries } = useItineraryStore();
  const { galleryImages, deleteImage, uploadFiles } = useGalleryStore();

  const handleDelete = async (fileName) => {
    console.log("Deleting image:", fileName);

    try {
      await deleteImage(params.tourId, fileName);
      fetchGallery(params.tourId);
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchLocations(), fetchCategories()]);
        if (params?.tourId) {
          await fetchTour(params.tourId);
          await fetchGallery(params.tourId);
          await fetchItinerariesByTourId(params.tourId);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setIsPageLoading(false);
      }
    };
    loadData();
  }, [params?.tourId]);

  const getFilename = (url) => {
    return url.split("/").pop();
  };

  const handleImageUpload = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + newImages.length + gallery.length > 20) {
      setError("Maximum 20 images allowed");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    setError(null);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (index) => {
    const item = gallery[index];
    if (!item) return;

    const fileName = getFilename(item.url || item);
    try {
      await handleDelete(fileName);
    } catch (error) {
      console.error("Error removing image:", error);
      setError("Failed to remove image");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formState.tour_id && formState.tour_id !== tour?.tour_id) {
        checkTourId(formState.tour_id);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formState.tour_id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormState((prev) => ({ ...prev, status: value }));
  };

  const handleDeleteItinerary = (index) => {
    setItineraryList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddClick = () => fileInputRef.current?.click();

  const toggleExpand = (index) => {
    setItineraryList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleItineraryChange = (index, field, value) => {
    setItineraryList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addNewItinerary = () => {
    setItineraryList((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        expanded: true,
      },
    ]);
  };

  const filteredLocations = locations.filter((loc) =>
    activeField && formState[activeField]
      ? loc.name.toLowerCase().includes(formState[activeField].toLowerCase())
      : []
  );

  const handleSelectLocation = (field, location) => {
    setFormState((prev) => ({
      ...prev,
      [field]: location.name,
    }));

    setLocationIds((prev) => ({
      ...prev,
      [field]: location._id,
    }));

    setShowSuggestions((prev) => ({
      ...prev,
      [field]: false,
    }));
    setActiveField(null);
  };

  const handleSelectCategory = (category) => {
    setFormState((prev) => ({
      ...prev,
      category: category.name,
    }));
    setCategoryId(category._id);
    setShowSuggestions((prev) => ({ ...prev, category: false }));
    setActiveField(null);
  };

  const filteredCategories = categories.filter((cat) =>
    formState.category
      ? cat.name.toLowerCase().includes(formState.category.toLowerCase())
      : []
  );

  const validateForm = () => {
    if (!formState.tour_name) {
      setError("Tour name is required");
      return false;
    }
    if (!formState.startDate || !formState.endDate) {
      setError("Start and end dates are required");
      return false;
    }
    if (new Date(formState.endDate) < new Date(formState.startDate)) {
      setError("End date must be after start date");
      return false;
    }
    if (!formState.price || isNaN(formState.price)) {
      setError("Valid price is required");
      return false;
    }
    if (!formState.limit || isNaN(formState.limit)) {
      setError("Valid participant limit is required");
      return false;
    }
    if (itineraryList.length === 0) {
      setError("At least one itinerary is required");
      return false;
    }
    if (itineraryList.some((item) => !item.name || !item.date)) {
      setError("All itineraries must have a name and date");
      return false;
    }
    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   setIsDone(false); // Reset isDone state

  //   try {
  //     // Upload new images first
  //     if (newImages.length > 0) {
  //       const imageFormData = new FormData();
  //       newImages.forEach((image) => imageFormData.append("files", image));
  //       await uploadFiles(params.id, params.tourId, imageFormData);
  //     }

  //     // Prepare tour data
  //     const tourData = {
  //       ...formState,
  //       start_location: locationIds.start_location || tour?.start_location?._id,
  //       first_destination:
  //         locationIds.first_destination || tour?.first_destination?._id,
  //       second_destination:
  //         locationIds.second_destination || tour?.second_destination?._id,
  //       category: categoryId || tour?.category?._id,
  //       itineraries: itineraryList,
  //     };

  //     await updateTour(params.tourId, tourData);
  //     setIsDone(true); // ✅ Mark as done
  //     // setCount(1);
  //   } catch (err) {
  //     console.error("Error updating tour:", err);
  //     setError(err.message || "Failed to update tour");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    setIsDone(false);
    setCount(1);
    try {
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((image) => imageFormData.append("files", image));
        await uploadFiles(params.id, params.tourId, imageFormData);
      }

      const tourData = {
        ...formState,
        start_location: locationIds.start_location || tour?.start_location?._id,
        first_destination:
          locationIds.first_destination || tour?.first_destination?._id,
        second_destination:
          locationIds.second_destination || tour?.second_destination?._id,
        category: categoryId || tour?.category?._id,
        itineraries: itineraryList,
      };

      await updateTour(params.tourId, tourData);

      // ✅ This triggers the animation flow
      setIsDone(true);
      router.push(`/admin/${params.id}/addpackage`);
    } catch (err) {
      console.error("Error updating tour:", err);
      setError(err.message || "Failed to update tour");
    } finally {
      setIsLoading(false); // Only hide loading spinner, not animation
    }
  };

  // Update form state when tour data is loaded
  useEffect(() => {
    if (tour) {
      setFormState({
        tour_id: tour.tour_id || "",
        tour_name: tour.tour_name || "",
        description: tour.description || "",
        price: tour.price || "",
        start_location: tour.start_location?.name || "",
        first_destination: tour.first_destination?.name || "",
        second_destination: tour.second_destination?.name || "",
        startDate: tour.startDate
          ? new Date(tour.startDate).toISOString().split("T")[0]
          : getToday(),
        endDate: tour.endDate
          ? new Date(tour.endDate).toISOString().split("T")[0]
          : getToday(),
        status: tour.status || "",
        overview: tour.overview || "",
        category: tour.category?.name || "",
        limit: tour.limit || "",
      });

      setLocationIds({
        start_location: tour.start_location?._id || "",
        first_destination: tour.first_destination?._id || "",
        second_destination: tour.second_destination?._id || "",
      });

      setCategoryId(tour.category?._id || "");
    }
  }, [tour]);

  // Update itinerary list when itineraries are loaded
  useEffect(() => {
    if (itineraries?.length) {
      setItineraryList(
        itineraries.map((item) => ({
          name: item.name || "",
          description: item.description || "",
          date: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : getToday(),
          startTime: item.startTime || "",
          endTime: item.endTime || "",
          expanded: false,
        }))
      );
    }
  }, [itineraries]);

  // Show loading animation when processing
  if (isLoading && !isDone) {
    return <TourCreatorLoading message="Updating your adventure..." />;
  }
  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
          <p className="mt-4 text-lg text-gray-700">Loading tour details...</p>
        </div>
      </div>
    );
  }
  // if (isLoading) {
  //   return <TourCreatorLoading message="Loading your tour update..." />;
  // }
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Tour</h1>
        <p className="text-gray-500">Update your tour details and itinerary</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tour Images */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 text-teal-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Tour Images
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-700">
                Upload up to 20 high-quality images
              </span>{" "}
              that showcase your tour (required).
              <br />
              <span className="text-gray-500 text-xs">
                Supported formats: jpeg, jpg, png, webp
              </span>
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                type="button"
                onClick={handleAddClick}
                disabled={gallery.length + newImages.length >= 20}
                variant="outline"
                className="h-24 w-24 border-dashed border-2 flex flex-col items-center justify-center gap-1"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">Add Image</span>
              </Button>

              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                disabled={gallery.length + newImages.length >= 20}
              />

              {/* Existing images */}
              {gallery.map((img, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative h-24 w-24 rounded-md overflow-hidden group"
                >
                  <img
                    src={img.url || img}
                    alt={`preview-${idx}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* New images */}
              {newImages.map((img, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative h-24 w-24 rounded-md overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(img) || "/placeholder.svg"}
                    alt={`preview-new-${idx}`}
                    className="h-full w-full object-cover"
                  />
                  <Badge className="absolute top-1 left-1 bg-teal-500 text-[10px]">
                    New
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <>
              {gallery.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {gallery.length + newImages.length}{" "}
                  {newImages.length === 1 ? "image" : "images"} selected (
                  {20 - newImages.length} remaining)
                </p>
              )}
            </>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Tour ID and Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tour_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tour ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="tour_id"
                      name="tour_id"
                      value={formState.tour_id}
                      onChange={handleFormChange}
                      placeholder="e.g., THO-000010"
                      required
                      disabled
                      className="w-full pl-10"
                    />
                    <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {isChecking && (
                    <p className="text-blue-500 text-sm mt-1 flex items-center">
                      <span className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent inline-block"></span>
                      Checking availability...
                    </p>
                  )}
                  {!isChecking &&
                    exists === true &&
                    formState.tour_id !== tour?.tour_id && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        This Tour ID is already taken
                      </p>
                    )}
                  {!isChecking && exists === false && formState.tour_id && (
                    <p className="text-green-500 text-sm mt-1 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      This Tour ID is available
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tour_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tour Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="tour_name"
                    name="tour_name"
                    value={formState.tour_name}
                    onChange={handleFormChange}
                    placeholder="Enter a catchy and descriptive name"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      name="startDate"
                      value={formState.startDate}
                      onChange={handleFormChange}
                      min={getToday()}
                      required
                      className="w-full pl-10"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      name="endDate"
                      value={formState.endDate}
                      onChange={handleFormChange}
                      min={formState.startDate || getToday()}
                      required
                      className="w-full pl-10"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Status and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formState.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Full">Full</SelectItem>
                      <SelectItem value="Close">Close</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="category"
                      name="category"
                      value={formState.category}
                      onChange={(e) => {
                        handleFormChange(e);
                        setActiveField("category");
                        setShowSuggestions((prev) => ({
                          ...prev,
                          category: true,
                        }));
                      }}
                      onFocus={() => {
                        setActiveField("category");
                        setShowSuggestions((prev) => ({
                          ...prev,
                          category: true,
                        }));
                      }}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowSuggestions((prev) => ({
                            ...prev,
                            category: false,
                          }));
                        }, 200)
                      }
                      placeholder="e.g., Adventure, Cultural, Beach"
                      className="w-full pl-10"
                    />
                    <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {showSuggestions.category &&
                    filteredCategories.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                        <ul className="py-1">
                          {filteredCategories.map((category) => (
                            <li
                              key={category._id}
                              onMouseDown={() => handleSelectCategory(category)}
                              className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-700"
                            >
                              {category.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>

              {/* Price and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      name="price"
                      value={formState.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-10"
                    />
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="limit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Participant Limit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="limit"
                      type="number"
                      name="limit"
                      value={formState.limit}
                      onChange={handleFormChange}
                      placeholder="Maximum number of participants"
                      min="1"
                      required
                      className="w-full pl-10"
                    />
                    <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-teal-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Locations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "start_location",
                "first_destination",
                "second_destination",
              ].map((field) => (
                <div key={field} className="relative">
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    {field === "start_location" && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>
                  <div className="relative">
                    <Input
                      id={field}
                      name={field}
                      value={formState[field]}
                      onChange={(e) => {
                        handleFormChange(e);
                        setActiveField(field);
                        setShowSuggestions((prev) => ({
                          ...prev,
                          [field]: true,
                        }));
                      }}
                      onFocus={() => {
                        setActiveField(field);
                        setShowSuggestions((prev) => ({
                          ...prev,
                          [field]: true,
                        }));
                      }}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowSuggestions((prev) => ({
                            ...prev,
                            [field]: false,
                          }));
                        }, 200)
                      }
                      placeholder={`Select ${field
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}`}
                      required={field === "start_location"}
                      className="w-full pr-10"
                    />
                    {formState[field] && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormState((prev) => ({ ...prev, [field]: "" }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {showSuggestions[field] && filteredLocations.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredLocations.map((location) => (
                          <li
                            key={location._id}
                            onMouseDown={() =>
                              handleSelectLocation(field, location)
                            }
                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-700"
                          >
                            {location.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description and Overview */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Tour Details
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Short Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  placeholder="Brief summary of the tour (appears in search results)"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="overview"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Detailed Overview <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="overview"
                  name="overview"
                  value={formState.overview}
                  onChange={handleFormChange}
                  placeholder="Comprehensive description of what travelers can expect"
                  rows={5}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itineraries */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Itinerary
                </h2>
              </div>
              <Badge
                variant="outline"
                className="text-teal-600 border-teal-200 bg-teal-50"
              >
                {itineraryList.length}{" "}
                {itineraryList.length === 1 ? "day" : "days"}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Manage the daily activities and schedules for your tour
            </p>

            <div className="space-y-4">
              {itineraryList.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden bg-white"
                >
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-teal-50 text-teal-700 border-teal-200"
                      >
                        Day {index + 1}
                      </Badge>
                      <h3 className="font-medium text-gray-800">
                        {item.name || "Untitled Day"}
                      </h3>
                      {item.date && (
                        <span className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItinerary(index);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {item.expanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {item.expanded && (
                    <div className="p-4 space-y-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Activity Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={item.name || ""}
                          onChange={(e) =>
                            handleItineraryChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., City Tour, Beach Day, Mountain Hike"
                          required
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Detailed description of the day's activities"
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleItineraryChange(
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            min={formState.startDate}
                            max={formState.endDate}
                            required
                            className="w-full pl-10"
                          />
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="time"
                              value={item.startTime || ""}
                              onChange={(e) =>
                                handleItineraryChange(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full pl-10"
                            />
                            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="time"
                              value={item.endTime || ""}
                              onChange={(e) =>
                                handleItineraryChange(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full pl-10"
                            />
                            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Button
                type="button"
                onClick={addNewItinerary}
                variant="outline"
                className="w-full py-6 border-dashed border-2 mt-4 flex items-center justify-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-200 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Another Day</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Updating Tour...
              </>
            ) : (
              "Update Tour"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
