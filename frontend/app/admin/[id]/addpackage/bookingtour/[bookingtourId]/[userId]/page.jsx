"use client";

import Image from "next/image";
import { Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileStore } from "@/store/profileStore";
import { userStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBookingStore } from "@/store/useBookingStore";
import { useTourStore } from "@/store/tourStore";
import { getCloudinaryUrl } from "@/utils/cloudinary";

export default function BookingConfirmation() {
  const params = useParams();
  const userId = params?.userId;
  const adminId = params?.id;
  const tourId = params?.bookingtourId;

  // console.log(params);

  const router = useRouter();

  const {
    user,
    useById,
    loading,
    error,
    fetchUserById,
    editUser,
    fetchUserByIdadmin,
  } = userStore();

  const {
    accommodation,
    setAccommodation,
    updateAccommodationOnServer,
    fetchTour,
    tour,
    fetchGallery,
    gallery,
  } = useTourStore();

  const {
    profileImage,
    setProfileImage,
    fetchProfileImage,
    uploadProfileImage,
  } = profileStore();

  const {
    bookings,
    bookingAll,
    totalSit,
    totalPrice,
    totalBookings,
    bookingsUser,
    loading: bookingLoading,
    error: bookingError,
    fetchBookingsByUserId,
    fetchBookingsByUser,
    fetchTourBookingsUser,
  } = useBookingStore();

  useEffect(() => {
    if (userId) {
      fetchBookingsByUserId(userId);
      fetchBookingsByUser(userId);
      fetchTourBookingsUser(tourId, userId);
    }
  }, [
    tourId,
    userId,
    fetchBookingsByUserId,
    fetchBookingsByUser,
    fetchTourBookingsUser,
  ]);

  useEffect(() => {
    fetchTourBookingsUser(tourId, userId);
  }, [tourId, userId, fetchTourBookingsUser]);


  useEffect(() => {
    if (userId) {
      fetchUserByIdadmin(adminId, userId);
      fetchProfileImage(userId);
    }
  }, [adminId, userId, fetchUserByIdadmin, fetchProfileImage]);

  useEffect(() => {
    if (tourId) fetchTour(tourId);
  }, [tourId, fetchTour]);

  const imageUrl = getCloudinaryUrl(useById?.profile_image);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="w-full max-w-full grid md:grid-cols-2 gap-4 bg-white rounded-lg overflow-hidden shadow-lg p-4">
        {/* Booking Details Card */}
        <div className="p-4 border rounded-lg">
          {/* User Profile */}
          <div className="flex items-center justify-between pb-4 border-b mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={imageUrl || "/placeholder.svg"}
                  alt="User profile image"
                />
                <AvatarFallback className="bg-sky-100">
                  {useById?.lastname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-medium">
                  {useById?.firstname} {useById?.lastname}
                </h2>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {useById?.status
                    ? useById.status.charAt(0).toUpperCase() +
                      useById.status.slice(1)
                    : "Active"}
                </span>
              </div>
            </div>

            <Link href={`/admin/${adminId}/edituser/${userId}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit
              </button>
            </Link>
          </div>
          {/* Latest Booking Display (if any) */}

          <div className="border rounded-lg overflow-hidden">
            <div className="border-b border-dashed border-blue-200 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-blue-600">
                  {tour?.tour_name}
                </h3>
                <p className="text-sm text-gray-500">#{tour?.tour_id}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                {tour?.status}
              </span>
            </div>

            <div className="border-b border-dashed border-blue-200 p-4">
              <div className="text-sm text-gray-500 mb-2">Sit</div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-400" />
                  <span>{totalSit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>People</span>
                </div>
              </div>
            </div>

            <div className="border-b border-dashed border-blue-200 p-4">
              <div className="text-sm text-gray-500 mb-2">Booking Date</div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <span>
                  {bookingsUser?.[0]?.createdAt &&
                    new Date(bookingsUser[0].createdAt).toLocaleString(
                      "en-US",
                      {
                        timeZone: "Asia/Phnom_Penh",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                </span>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500 mb-2">Tour Date</div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span>
                    {new Date(
                      bookingsUser?.[0]?.tourId?.startDate
                    ).toLocaleDateString()}
                    -
                    {new Date(
                      bookingsUser?.[0]?.tourId?.endDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Tour
              </Button>
            </div>
          </div>
        </div>

        {/* Tour Images */}

        <div className="grid grid-rows-3 gap-2">
          {/* Main large image */}
          <div className="row-span-2 relative h-full min-h-[300px]">
            <Image
              src={tour?.galleryImages?.[0] || "/image/1.jpg"}
              alt={tour?.tour_name || "Tour"}
              fill
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Three small images */}
          <div className="grid grid-cols-3 gap-2 row-span-1">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="relative h-full min-h-[100px]">
                <Image
                  src={tour?.galleryImages?.[idx + 1] || "/image/1.jpg"}
                  alt={`Tour image ${idx + 2}`}
                  fill
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Tour History Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            User Tour History
          </h2>
          <div className="flex gap-4 mt-2 md:mt-0">
            <div className="flex justify-between bg-gray-50 p-4 rounded-md shadow mb-4">
              <div className="text-gray-700 font-semibold">
                Total Seats Booked: {totalSit}
              </div>
              <div className="text-gray-700 font-semibold">
                Total Price: ${totalPrice?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 uppercase text-gray-500 text-xs">
              <tr>
                <th className="px-6 py-3">Tour</th>
                <th className="px-6 py-3">Booked Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Seats</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Start</th>
                <th className="px-6 py-3">End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {bookingsUser.map((tour, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-14 rounded overflow-hidden">
                        <Image
                          src={
                            tour?.galleryImages?.[0] ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={tour.tourId.tour_name || "Tour"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">
                          #{tour._id.slice(-6)}
                        </p>
                        <p className="font-medium text-gray-800">
                          {tour.tourId.tour_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {bookingsUser?.[0]?.createdAt &&
                      new Date(bookingsUser[0].createdAt).toLocaleString(
                        "en-US",
                        {
                          timeZone: "Asia/Phnom_Penh",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        tour.bookingStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tour.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">{tour.bookingSit}</td>
                  <td className="px-6 py-4">${tour.bookingTotal}</td>
                  <td className="px-6 py-4">
                    {tour?.tourId?.startDate
                      ? new Date(tour.tourId.startDate).toLocaleString(
                          "en-US",
                          {
                            timeZone: "Asia/Phnom_Penh",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {tour?.tourId?.startDate
                      ? new Date(tour.tourId.endDate).toLocaleString("en-US", {
                          timeZone: "Asia/Phnom_Penh",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
