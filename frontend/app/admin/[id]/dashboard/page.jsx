// // app/(admin)/[id]/add/page.jsx

"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { userStore } from "@/store/userStore";
import { useEffect } from "react";
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
import { useTourStore } from "@/store/tourStore";
import { useBookingStore } from "@/store/useBookingStore";

export default function AdminDashboard() {
  const { id } = useParams();
  const { user, loading, error, fetchUserById, getAllUsers, count } =
    userStore();

  const {
    fetchAllTourBookings,
    total,
    bookings: bookingTour,
  } = useBookingStore();

  const { fetchGalleryImages, countTour } = useTourStore();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      getAllUsers(id);
    }
    fetchAllTourBookings();
  }, [id, getAllUsers, fetchAllTourBookings]);

  useEffect(() => {
    fetchGalleryImages(); // Fetch gallery images when the component mounts
  }, [fetchGalleryImages]);

  // if (loading) return <p>Loading user...</p>;
  // if (error) return <p className="text-red-500">{error}</p>;
  // if (!user) return <p>No user found.</p>

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [bookings, setBookings] = useState([
    {
      id: "#12312",
      userName: "Nacho Varga",
      tourName: "Adventure Trip",
      tourRating: 4.5,
      status: "Booked",
      bookedDate: "2025-02-19",
    },
    {
      id: "#45635",
      userName: "Lalo Salamanca",
      tourName: "Relaxation Getaway",
      tourRating: 4.2,
      status: "Booked",
      bookedDate: "2025-02-19",
    },
    {
      id: "#53224",
      userName: "Pablo Escobar",
      tourName: "Historical Tour",
      tourRating: 4.8,
      status: "Booked",
      bookedDate: "2025-02-19",
    },
    {
      id: "#13242",
      userName: "Jesse Pinkman",
      tourName: "Adventure Trip",
      tourRating: 4.0,
      status: "Booked",
      bookedDate: "2025-02-19",
    },
    {
      id: "#12341",
      userName: "Jimmy McGill",
      tourName: "Relaxation Getaway",
      tourRating: 3.9,
      status: "Cancel",
      bookedDate: "2025-02-20",
    },
    {
      id: "#17534",
      userName: "Gus Fring",
      tourName: "Historical Tour",
      tourRating: 4.7,
      status: "Booked",
      bookedDate: "2025-02-20",
    },
  ]);

  const toggleStatus = (id) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: booking.status === "Booked" ? "Cancel" : "Booked",
            }
          : booking
      )
    );
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-700">
                {count || "0"}
              </h2>
              <p className="text-sm text-gray-500">Total User</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-700">{total}</h2>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-700">
                {countTour ? countTour : "0"}
              </h2>

              <p className="text-sm text-gray-500">Total Tour</p>
            </div>
            <div className="text-2xl">📦</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-700">Bookings</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by tour name"
                className="pl-10 pr-4 py-2 border rounded-lg w-96"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-[20px] h-[20px]"
              />
            </div>
            <select className="px-4 py-2 border rounded-lg text-sm">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">Tour Name</th>
              <th className="px-4 py-2">booking Sit</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Booked Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingTour.map((booking, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{booking?.tourId?.tour_id}</td>
                <td className="px-4 py-3">
                  {booking?.userId?.firstname} {booking?.userId?.lastname}
                </td>
                <td className="px-4 py-3">{booking?.tourId?.tour_name}</td>
                <td className="px-4 py-3">{booking.bookingSit}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(booking.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking?.tourId?.status === "Ongoing"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {booking?.tourId?.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {new Date(booking.createdAt).toLocaleDateString()}
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
