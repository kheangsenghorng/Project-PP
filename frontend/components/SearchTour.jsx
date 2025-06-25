"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useTourStore } from "@/store/tourStore";
import { useRouter, useSearchParams } from "next/navigation";

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

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setFilterParams, fetchFilteredTours } = useTourStore();

  const handleSearch = async () => {
    if (!destination || !startDate || !endDate) {
      setError("Location, start date, and end date are required.");
      return;
    }

    setLoading(true);
    setError(null);

    setFilterParams({
      location: destination,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });

    try {
      await fetchFilteredTours();
    } catch (err) {
      setError("Failed to fetch tours. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");
  const startParam = searchParams.get("startDate");
  const endParam = searchParams.get("endDate");

  useEffect(() => {
    if (!locationParam || !startParam || !endParam) return;

    setDestination(locationParam);
    setStartDate(new Date(startParam));
    setEndDate(new Date(endParam));
  }, []); // Set state only once on mount

  // useEffect(() => {
  //   if (!destination || !startDate || !endDate) return;

  //   const runSearchAndCleanURL = async () => {
  //     await handleSearch(); // wait for search

  //     // Replace current URL with clean version (no query string)
  //     router.replace("/tourpage/list-tour");
  //   };

  //   runSearchAndCleanURL();
  // }, [destination, startDate, endDate]);

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
