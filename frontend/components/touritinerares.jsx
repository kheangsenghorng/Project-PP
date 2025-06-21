"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useTourStore } from "@/store/tourStore";

export default function TourItinerary() {
  const { tourId } = useParams();
  const [showEndInfo, setShowEndInfo] = useState(false);
  const { loading, error, fetchTour, tour, itineraries = [] } = useTourStore();

  useEffect(() => {
    if (tourId) {
      fetchTour(tourId);
    }
  }, [tourId]);

  const startDate = tour?.startDate ? new Date(tour.startDate) : null;
  const endDate = tour?.endDate ? new Date(tour.endDate) : null;

  const formatDate = (date) =>
    date?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const diff = Math.abs(endDate - startDate);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getCompletionPercent = () => {
    if (!itineraries?.length) return 0;
    const completed = itineraries.filter((item) => item.endDate).length;
    return Math.round((completed / itineraries.length) * 100);
  };

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 rounded-lg border border-red-200 bg-red-50">
        Error fetching itineraries: {error}
      </div>
    );
  }

  const TourEndInfo = () => (
    <Card className="mt-6 border-teal-100 bg-teal-50/30 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-teal-700 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Tour End Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              Start Date
            </span>
            <Badge variant="outline" className="font-medium bg-white">
              {formatDate(startDate)}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              End Date
            </span>
            <Badge variant="outline" className="font-medium bg-white">
              {formatDate(endDate)}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-600" />
              Duration
            </span>
            <Badge variant="outline" className="font-medium bg-white">
              {calculateDuration()} days
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />
              Last Activity
            </span>
            <Badge variant="outline" className="font-medium bg-white">
              {itineraries[itineraries.length - 1]?.name || "N/A"}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" />
                Tour Progress
              </span>
              <Badge variant="outline" className="font-medium bg-white">
                {getCompletionPercent()}% Complete
              </Badge>
            </div>
            <Progress value={getCompletionPercent()} className="h-2 bg-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold text-gray-800">
            Tour Itinerary
          </h1>
          <Badge className="bg-teal-600 hover:bg-teal-700">
            {getCompletionPercent()}% Complete
          </Badge>
        </div>
        <div className="text-sm flex items-center gap-2 text-gray-600 bg-white p-2 rounded-lg shadow-sm">
          <MapPin className="h-4 w-4 text-teal-600" />
          <span className="font-medium">
            {tour?.start_location?.name || "N/A"}
            {tour?.first_destination?.name && (
              <span className=" items-center gap-1 inline-flex">
                <ChevronRight className="h-3 w-3" />
                {tour.first_destination.name}
              </span>
            )}
            {tour?.second_destination?.name && (
              <span className=" items-center gap-1 inline-flex">
                <ChevronRight className="h-3 w-3" />
                {tour.second_destination.name}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="relative">
          {Array.isArray(itineraries) &&
            itineraries.map((item, index) => {
              const formattedDate = item?.date
                ? new Date(item.date).toLocaleDateString("km-KH", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })
                : "";

              return (
                <div key={index} className="flex mb-8 relative">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`rounded-full h-10 w-10 flex items-center justify-center z-10 shadow-sm ${
                        item.day
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {item.day ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < itineraries.length - 1 && (
                      <div className="w-0.5 bg-gray-200 h-full absolute top-10 left-5 -ml-[1px]"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3 w-3 text-teal-600" />
                      <div className="text-sm text-gray-500">
                        {formattedDate}
                      </div>
                    </div>
                    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <h3 className="font-medium text-gray-900 text-lg">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-600 gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            {item.startTime} - {item.endTime}
                          </Badge>
                          {item.day && (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Completed at {item.day}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-teal-50 text-teal-700 gap-1"
                              >
                                <span className="h-2 w-2 bg-teal-500 rounded-full animate-pulse"></span>
                                In progress
                              </Badge>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
        </div>

        {showEndInfo && <TourEndInfo />}

        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 shadow-sm"
              >
                Check Tour End Time/Day
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-teal-700">
                  Tour End Information
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50 p-3 rounded-md shadow-sm">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      Start Date
                    </div>
                    <div className="font-medium">{formatDate(startDate)}</div>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-md shadow-sm">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      End Date
                    </div>
                    <div className="font-medium">{formatDate(endDate)}</div>
                  </div>
                </div>

                <div className="bg-teal-50 p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-600" />
                    Last Activity
                  </div>
                  {itineraries.length > 0 ? (
                    <>
                      <div className="font-medium">
                        {itineraries[itineraries.length - 1]?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {itineraries[itineraries.length - 1]?.description || ""}
                      </div>
                    </>
                  ) : (
                    <div>No itinerary data available.</div>
                  )}
                </div>

                <div className="bg-teal-50 p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-600" />
                    Completion Status
                  </div>
                  <div className="font-medium">
                    {getCompletionPercent()}% of Tour Completed
                  </div>
                  <Progress
                    value={getCompletionPercent()}
                    className="h-2.5 mt-2"
                  />
                </div>

                <div className="bg-green-50 p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Completed Activities
                  </div>
                  <div className="space-y-2 mt-2">
                    {Array.isArray(itineraries) &&
                      itineraries
                        .filter((item) => {
                          const date = item?.date ? new Date(item.date) : null;
                          return (
                            date &&
                            (!startDate || date >= startDate) &&
                            (!endDate || date <= endDate)
                          );
                        })
                        .map((item, index) => {
                          const day = new Date(item.date).toLocaleDateString(
                            "km-KH",
                            {
                              weekday: "long",
                            }
                          );
                          return (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>{item.name}</span>
                              <span
                                className={
                                  tour.endDate
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }
                              >
                                {day} {tour.endDate ? "✓" : ""}
                              </span>
                            </div>
                          );
                        })}
                  </div>
                </div>

                <Button
                  onClick={() => setShowEndInfo(true)}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  Show End Info on Itinerary
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
  