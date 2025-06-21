"use client";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


export default function TourManagement() {

  const [tours, setTours] = useState([
    {
      id: "#00001",
      name: "Nacho Varga",
      price: "$120",
      date: "2020/02/09 - 25",
      destination: "Phnom Penh",
      participants: "20/20",
      rating: 4.5,
      status: "Full",
    },
    {
      id: "#00002",
      name: "Lalo Salamanca",
      price: "$120",
      date: "2020/02/09 - 25",
      destination: "Phnom Penh - SiemReap",
      participants: "10/20",
      rating: 5.0,
      status: "Ongoing",
    },
    {
      id: "#00003",
      name: "Pablo Escobar",
      price: "$120",
      date: "2020/02/09 - 25",
      destination: "Phnom Penh - SiemReap - Kep",
      participants: "15/15",
      rating: 4.4,
      status: "Full",
    },
    {
      id: "#00004",
      name: "Jesse Pinkman",
      price: "$120",
      date: "2020/02/09 - 25",
      destination: "Phnom Penh - Kep",
      participants: "#####",
      rating: 1.2,
      status: "Close",
    },
    {
      id: "#00005",
      name: "Jimmy McGill",
      price: "$120",
      date: "2020/02/09 - 25",
      destination: "Phnom Penh - SiemReap",
      participants: "12/13",
      rating: 3.8,
      status: "Ongoing",
    },
    {
      id: "#00006",
      name: "Gus Fring",
      price: "$120",
      date: "2020/02/09 - 25",
      destination: "Phnom Penh - SiemReap - Kep",
      participants: "15/20",
      rating: 4.8,
      status: "Ongoing",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Full":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Ongoing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Close":
        return "bg-rose-100 text-rose-800 hover:bg-rose-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tour Management</h1>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Tour
            </Button>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                className="pl-10 w-64"
                placeholder="Search by name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Tour Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Base Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Start/End Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Destination
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Participants
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Rating
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr
                  key={tour.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-sm">{tour.id}</td>
                  <td className="py-4 px-4 text-sm">{tour.name}</td>
                  <td className="py-4 px-4 text-sm">{tour.price}</td>
                  <td className="py-4 px-4 text-sm">{tour.date}</td>
                  <td className="py-4 px-4 text-sm">{tour.destination}</td>
                  <td className="py-4 px-4 text-sm">{tour.participants}</td>
                  <td className="py-4 px-4 text-sm">{tour.rating}</td>
                  <td className="py-4 px-4 text-sm">
                    <Badge className={getStatusBadgeClass(tour.status)}>
                      {tour.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 size={18} className="text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 size={18} className="text-gray-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Prev. Date
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-blue-200"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <span className="text-gray-500">...</span>
            <span className="text-gray-500">...</span>
            <Button variant="outline" size="sm">
              35
            </Button>
            <Button variant="outline" size="sm">
              36
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            Next Date
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
