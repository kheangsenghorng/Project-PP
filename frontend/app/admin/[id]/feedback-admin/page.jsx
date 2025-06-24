"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Plus,
  Star,
  Calendar,
  MapPin,
  Users,
  Filter,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useTourStore } from "@/store/tourStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function TourManagement() {
  const params = useParams();
  const { fetchTours, tours, isLoading, error } = useTourStore();

  useEffect(() => {
    fetchTours(params.id);
  }, [fetchTours, params.id]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("tour_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter tours based on search query and status filter
  const filteredTours = !isLoading
    ? tours.filter((tour) => {
        const matchesSearch =
          (tour.tour_name &&
            tour.tour_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tour.tour_id &&
            tour.tour_id.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === "all" || tour.status === statusFilter;

        const hasAverageRating = tour.averageRating && tour.averageRating > 0;

        return matchesSearch && matchesStatus && hasAverageRating;
      })
    : [];

  // Sort tours based on sort field and direction
  const sortedTours = [...filteredTours].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle special cases
    if (sortField === "price") {
      aValue = Number.parseFloat(a.price) || 0;
      bValue = Number.parseFloat(b.price) || 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTours = sortedTours.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Full":
        return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      case "Ongoing":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "Close":
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "Available":
        return "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const statusOptions = ["all", "Available", "Ongoing", "Full", "Close"];

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-white dark:bg-gray-950 rounded-xl overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Feedback Tour
                </CardTitle>
                <CardDescription>
                  Manage your tours, track bookings, and monitor performance
                </CardDescription>
              </div>
              {/* <div className="flex items-center gap-2">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all hover:shadow-lg h-9">
                  <Plus size={16} className="mr-2" />
                  Create New Tour
                </Button>
              </div> */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className=" w-full sm:w-auto">
              <Input
                className="pl-10 w-full sm:w-80"
                placeholder="Search by name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter size={16} className="mr-2" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statusOptions.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? "bg-muted" : ""}
                    >
                      {status === "all" ? "All" : status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading tours: {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th
                        className="py-3 px-4 text-left font-medium text-xs text-muted-foreground cursor-pointer"
                        onClick={() => handleSort("tour_id")}
                      >
                        <div className="flex items-center">
                          ID
                          {sortField === "tour_id" && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>

                      <th className="py-3 px-4 text-left font-medium text-xs text-muted-foreground">
                        TOUR IMAGE
                      </th>
                      <th
                        className="py-3 px-4 text-left font-medium text-xs text-muted-foreground cursor-pointer"
                        onClick={() => handleSort("tour_name")}
                      >
                        <div className="flex items-center">
                          TOUR NAME
                          {sortField === "tour_name" && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 text-left font-medium text-xs text-muted-foreground cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center">
                          BASE PRICE
                          {sortField === "price" && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-xs text-muted-foreground">
                        DATES
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-xs text-muted-foreground">
                        DESTINATION
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-xs text-muted-foreground">
                        CATEGORY
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-xs text-muted-foreground">
                        PARTICIPANTS
                      </th>
                      <th
                        className="py-3 px-4 text-left font-medium text-xs text-muted-foreground cursor-pointer"
                        onClick={() => handleSort("averageRating")}
                      >
                        <div className="flex items-center">
                          RATING
                          {sortField === "averageRating" && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 text-left font-medium text-xs text-muted-foreground cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          STATUS
                          {sortField === "status" && (
                            <ArrowUpDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      {/* <th className="py-3 px-4 text-left font-medium text-xs text-muted-foreground">
                        ACTIONS
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTours.length > 0 ? (
                      paginatedTours.map((tour) => (
                        <tr
                          key={tour._id}
                          className="border-t hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-nowrap">
                            <Link
                              href={`/admin/${params.id}/feedback-admin/tourfeedback/${tour._id}`}
                            >
                              {tour?.tour_id || "N/A"}
                            </Link>
                          </td>

                          <td className="py-3 px-4 text-sm">
                            <div className="h-14 w-24 rounded-md overflow-hidden border">
                              <img
                                src={
                                  tour.galleryImages[0] ||
                                  "/placeholder.svg?height=56&width=96"
                                }
                                alt={tour.tour_name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-nowrap">
                            {tour.tour_name}
                          </td>

                          <td className="py-3 px-4 text-sm">
                            <span className="font-medium">${tour.price}</span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center">
                              <Calendar
                                size={14}
                                className="mr-2 text-muted-foreground"
                              />
                              <div className="flex flex-col text-nowrap">
                                <span>
                                  {tour.startDate
                                    .split("T")[0]
                                    .replace(/-/g, "/")}{" "}
                                  - {tour.endDate.split("T")[0].split("-")[2]}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm ">
                            <div className="flex items-center">
                              <MapPin
                                size={14}
                                className="mr-2 text-muted-foreground"
                              />
                              <div className="flex flex-col text-nowrap">
                                <span>{tour?.start_location?.name}</span>
                                <span className="text-muted-foreground">
                                  {tour?.first_destination?.name}
                                  {tour?.second_destination?.name &&
                                    ` → ${tour.second_destination?.name}`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className="font-medium text-nowrap">
                              {tour.category?.name}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center">
                              <Users
                                size={14}
                                className="mr-2 text-muted-foreground"
                              />
                              <span className="inline-flex items-center justify-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                {tour.totalBookedSeats}/{tour.limit || "∞"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center">
                              <span className="mr-1">
                                {tour.averageRating || "0"}
                              </span>
                              <Star
                                size={14}
                                className="fill-amber-400 text-amber-400"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <Badge
                              className={getStatusBadgeVariant(tour.status)}
                            >
                              {tour.status}
                            </Badge>
                          </td>
                          {/* <td className="py-3 px-4 text-sm">
                            <div className="flex gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Edit2 size={16} />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit tour</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 size={16} />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete tour</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="py-8 text-center text-muted-foreground"
                        >
                          {searchQuery
                            ? "No tours match your search"
                            : "No tours available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredTours.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredTours.length)}{" "}
                    of {filteredTours.length} tours
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ChevronLeft size={16} />
                      <span className="sr-only">Previous page</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="icon"
                            className={`h-8 w-8 ${
                              page === currentPage
                                ? "bg-teal-600 hover:bg-teal-700"
                                : ""
                            }`}
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ChevronRight size={16} />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
