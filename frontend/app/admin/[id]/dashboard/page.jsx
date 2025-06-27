"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { userStore } from "@/store/userStore";
import { useTourStore } from "@/store/tourStore";
import { useBookingStore } from "@/store/useBookingStore";
import {
  faTachometerAlt,
  faBook,
  faThLarge,
  faPlusSquare,
  faCommentDots,
  faSignOutAlt,
  faBell,
  faSearch,
  faCopy,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const { id } = useParams();

  const { user, loading, error, fetchUserById, getAllUsers, count } =
    userStore();
  const { fetchAllTourBookings, total, bookings } = useBookingStore();
  const { fetchGalleryImages, countTour } = useTourStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    if (id) {
      fetchUserById(id);
      getAllUsers(id);
    }
    fetchAllTourBookings();
  }, [id]);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  const filteredBookings = bookings
    .filter((b) => {
      const tourName = b?.tourId?.tour_name?.toLowerCase() || "";
      const tourCode = b?.tourId?.tour_id?.toLowerCase() || "";
      const firstName = b?.userId?.firstname?.toLowerCase() || "";
      const lastName = b?.userId?.lastname?.toLowerCase() || "";
      const fullName = `${firstName} ${lastName}`;

      const search = searchTerm.toLowerCase();
      return (
        tourName.includes(search) ||
        tourCode.includes(search) ||
        firstName.includes(search) ||
        lastName.includes(search) ||
        fullName.includes(search)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  const toggleStatus = (bookingId) => {
    console.log("Toggle status for booking:", bookingId);
    // You can call an action or API here to update status
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <SummaryCard title="Total User" value={count} icon="👥" />
        <SummaryCard title="Total Bookings" value={total} icon="⏳" />
        <SummaryCard title="Total Tour" value={countTour} icon="📦" />
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-700">Bookings</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by tour name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-96"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-[20px] h-[20px]"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">Tour Name</th>
              <th className="px-4 py-2">Booking Sit</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Booked Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  {booking?.tourId?.tour_id || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {booking?.userId?.firstname} {booking?.userId?.lastname}
                </td>
                <td className="px-4 py-3">{booking?.tourId?.tour_name}</td>
                <td className="px-4 py-3">{booking?.bookingSit}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(booking?._id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking?.tourId?.status === "Ongoing"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {booking?.tourId?.status || "Unknown"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {new Date(booking?.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-blue-500">
                      <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:text-blue-500">
                      <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// 👇 Extracted summary card component for reusability
function SummaryCard({ title, value, icon }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">{value || "0"}</h2>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
