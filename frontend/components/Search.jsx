"use client";

import { useState } from "react";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTourStore } from "@/store/tourStore"; // Ensure you're importing the correct store
import { useRouter } from "next/navigation";

const provinces = [
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

export default function SearchTour() {
  const router = useRouter();
  // const userId = router.query.id; // Assuming user ID is passed in the query params
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 added
  const [error, setError] = useState(null); // 👈 added
  // Access Zustand store functions
  const { setFilterParams, fetchFilteredTours } = useTourStore();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    const formattedStartDate = startDate
      ? format(startDate, "yyyy-MM-dd")
      : null;
    const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : null;

    // Set filter parameters (Zustand or useState, depending on your app)
    setFilterParams({
      location: destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });

    // Build query params
    const queryParams = new URLSearchParams();
    if (destination) queryParams.append("location", destination);
    if (formattedStartDate) queryParams.append("startDate", formattedStartDate);
    if (formattedEndDate) queryParams.append("endDate", formattedEndDate);

    try {
      await fetchFilteredTours();

      // Navigate to bookings page with filters
      router.push(`/tourpage/list-tour/?${queryParams.toString()}`);
    } catch (err) {
      setError("Failed to fetch tours. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-5 flex h-[100px] w-full max-w-[1000px] items-center justify-between rounded-full border bg-white p-6 shadow-md">
      {/* Destination Dropdown */}
      <div className="w-1/3">
        <label className="text-sm font-semibold text-gray-600">Where to</label>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger className="mt-1 border-none font-semibold shadow-none focus:ring-0">
            <SelectValue placeholder="Select a Province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vertical Line */}
      <div className="mx-4 h-8 border-l-2 border-gray-300"></div>

      {/* Date Section */}
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          {/* Start Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start rounded-full border-none pl-3 font-semibold text-gray-600 shadow-none",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          {/* Vertical Line */}
          <div className="mx-2 h-8 border-l-2 border-gray-300"></div>

          {/* End Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start rounded-full border-none pl-3 font-semibold text-gray-600 shadow-none",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>End Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) =>
                  date < new Date() || (startDate ? date < startDate : false)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        {startDate && endDate && (
          <div className="mt-2 text-sm text-gray-800">
            {format(startDate, "MMM d, yyyy")} -{" "}
            {format(endDate, "MMM d, yyyy")}
          </div>
        )}
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={loading}
        className="relative h-12 w-12 rounded-full bg-green-500 p-0 hover:bg-green-600"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          <Search className="h-5 w-5" />
        )}
        <span className="sr-only">Search</span>
      </Button>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
