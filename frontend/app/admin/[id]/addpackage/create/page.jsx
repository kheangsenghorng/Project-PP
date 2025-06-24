"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTourStore } from "@/store/tourStore";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const getToday = () => {
  const t = new Date();
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function CreateTourPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchTours, tours, createTour, exists, checkTourId, isChecking } =
    useTourStore();

  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState({
    start_location: false,
    first_destination: false,
    second_destination: false,
    category: false,
  });
  const [activeField, setActiveField] = useState(null);
  const [categoryId, setCategoryId] = useState("");

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

  const [formState, setFormState] = useState({
    tour_name: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    overview: "",
    category: "",
    limit: "",
    start_location: "",
    first_destination: "",
    second_destination: "",
  });

  const [locationIds, setLocationIds] = useState({
    start_location: "",
    first_destination: "",
    second_destination: "",
  });

  const [itineraries, setItineraries] = useState([
    {
      name: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      expanded: true,
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchLocations(),
          fetchCategories(),
          fetchTours(params.id),
        ]);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setIsPageLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formState.tour_id) {
        checkTourId(formState.tour_id);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formState.tour_id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteItinerary = (index) => {
    setItineraries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddClick = () => fileInputRef.current?.click();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 20) {
      setError("Maximum 20 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setError(null);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExpand = (index) => {
    setItineraries((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleItineraryChange = (index, field, value) => {
    setItineraries((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(formState[activeField]?.toLowerCase() || "")
  );

  const handleSelectCategory = (category) => {
    setFormState((prev) => ({
      ...prev,
      category: category.name, // For display
    }));
    setCategoryId(category._id); // Store the ID for submission
    setShowSuggestions((prev) => ({ ...prev, category: false }));
    setActiveField(null);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(formState.category?.toLowerCase() || "")
  );

  const handleSelectLocation = (location) => {
    setFormState((prev) => ({
      ...prev,
      [activeField]: location.name,
    }));

    setLocationIds((prev) => ({
      ...prev,
      [activeField]: location._id,
    }));

    setShowSuggestions((prev) => ({
      ...prev,
      [activeField]: false,
    }));
  };

  const handleInputFocus = (fieldName) => {
    setActiveField(fieldName);
    setShowSuggestions((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const handleInputBlur = (fieldName) => {
    setTimeout(() => {
      setShowSuggestions((prev) => ({
        ...prev,
        [fieldName]: false,
      }));
    }, 200);
  };

  const addNewItinerary = () => {
    setItineraries((prev) => [
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

  const validateForm = () => {
    if (!formState.tour_name) {
      setError("Tour name is required");
      return false;
    }
    if (images.length === 0) {
      setError("Tour images are required");
      return false;
    }
    if (!locationIds.start_location) {
      setError("Start location is required");
      return false;
    }
    if (!categoryId) {
      setError("Category is required");
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
    if (itineraries.length === 0) {
      setError("At least one itinerary is required");
      return false;
    }
    if (itineraries.some((item) => !item.name || !item.date)) {
      setError("All itineraries must have a name and date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const formData = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      // Skip location fields (we'll handle them separately with their IDs)
      if (
        ["start_location", "first_destination", "second_destination"].includes(
          key
        )
      ) {
        return;
      }

      // Skip category field (we'll handle it separately with its ID)
      if (key === "category") {
        return;
      }

      // Add all other fields that have values
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    if (locationIds.start_location) {
      formData.append("start_location", locationIds.start_location);
    }

    if (locationIds.first_destination) {
      formData.append("first_destination", locationIds.first_destination);
    }

    if (locationIds.second_destination) {
      formData.append("second_destination", locationIds.second_destination);
    }

    if (categoryId) {
      formData.append("category", categoryId);
    }

    images.forEach((image) => formData.append("files", image));
    formData.append("itineraries", JSON.stringify(itineraries));

    setIsLoading(true);
    try {
      await createTour(formData, params.id);
      router.push(`/admin/${params.id}/addpackage`);
    } catch (err) {
      setError(err.message || "Failed to create tour");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TourCreatorLoading message="Loading your tour creator..." />;
  }
  
  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
        <p className="mt-4 text-lg text-gray-700">
          Loading your tour creator...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Tour
        </h1>
        <p className="text-gray-500">
          Fill in the details to create an amazing tour experience
        </p>
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
                disabled={images.length >= 20}
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
                disabled={images.length >= 20}
              />

              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-24 w-24 rounded-md overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(img) || "/placeholder.svg"}
                    alt={`preview-${idx}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {images.length > 0 && (
              <p className="text-sm text-gray-500 mt-3">
                {images.length} {images.length === 1 ? "image" : "images"}{" "}
                selected ({20 - images.length} remaining)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Tour Name */}
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

              {/* Category */}
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
                    onChange={handleFormChange}
                    onFocus={() => handleInputFocus("category")}
                    onBlur={() => handleInputBlur("category")}
                    placeholder="e.g., Adventure, Cultural, Beach"
                    className="w-full pl-10"
                  />
                  <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {showSuggestions.category && filteredCategories.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {filteredCategories.map((category) => (
                        <li
                          key={category._id}
                          onClick={() => handleSelectCategory(category)}
                          className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-700"
                        >
                          {category.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
              {/* Start Location */}
              <div className="relative">
                <label
                  htmlFor="start_location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Location <span className="text-red-500">*</span>
                </label>
                <Input
                  id="start_location"
                  name="start_location"
                  value={formState.start_location}
                  onChange={handleFormChange}
                  onFocus={() => handleInputFocus("start_location")}
                  onBlur={() => handleInputBlur("start_location")}
                  placeholder="Where the tour begins"
                  required
                  className="w-full"
                />
                {showSuggestions.start_location &&
                  filteredLocations.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredLocations.map((location) => (
                          <li
                            key={location._id}
                            onClick={() => handleSelectLocation(location)}
                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-700"
                          >
                            {location.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* First Destination */}
              <div className="relative">
                <label
                  htmlFor="first_destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Destination
                </label>
                <Input
                  id="first_destination"
                  name="first_destination"
                  value={formState.first_destination}
                  onChange={handleFormChange}
                  onFocus={() => handleInputFocus("first_destination")}
                  onBlur={() => handleInputBlur("first_destination")}
                  placeholder="Optional first stop"
                  className="w-full"
                />
                {showSuggestions.first_destination &&
                  filteredLocations.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredLocations.map((location) => (
                          <li
                            key={location._id}
                            onClick={() => handleSelectLocation(location)}
                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-700"
                          >
                            {location.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Second Destination */}
              <div className="relative">
                <label
                  htmlFor="second_destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Second Destination
                </label>
                <Input
                  id="second_destination"
                  name="second_destination"
                  value={formState.second_destination}
                  onChange={handleFormChange}
                  onFocus={() => handleInputFocus("second_destination")}
                  onBlur={() => handleInputBlur("second_destination")}
                  placeholder="Optional second stop"
                  className="w-full"
                />
                {showSuggestions.second_destination &&
                  filteredLocations.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredLocations.map((location) => (
                          <li
                            key={location._id}
                            onClick={() => handleSelectLocation(location)}
                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-700"
                          >
                            {location.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
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
                {itineraries.length} {itineraries.length === 1 ? "day" : "days"}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Plan each day of your tour with detailed activities and schedules
            </p>

            <div className="space-y-4">
              {itineraries.map((item, index) => (
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
                Creating Tour...
              </>
            ) : (
              "Create Tour"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
