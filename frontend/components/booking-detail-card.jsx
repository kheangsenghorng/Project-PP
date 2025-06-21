"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, ChevronRight, Clock, CreditCard, Mail, MapPin, Phone, Users, X } from "lucide-react"

export function BookingDetailCard({ selectedBooking, bookings, showDetailCard, closeDetailCard, handleViewDetails }) {
  if (!selectedBooking || !showDetailCard) return null

  function formatBookingDate(dateString) {
    const date = new Date(dateString)
    const options = { month: "short", year: "numeric" }
    const day = date.getDate()

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th"
      switch (day % 10) {
        case 1:
          return "st"
        case 2:
          return "nd"
        case 3:
          return "rd"
        default:
          return "th"
      }
    }

    const formattedDate = `${
      date.toLocaleString("en-US", options).split(" ")[0]
    } ${day}${getDaySuffix(day)}, ${date.getFullYear()}`
    return formattedDate
  }

  function formatTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all duration-300 ${
          showDetailCard ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Booking Details</h3>
              <p className="text-purple-100 mt-1 text-sm">Booking #{selectedBooking.tour_id?.substring(0, 8)}</p>
            </div>
            <button
              onClick={closeDetailCard}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Guest Information Card */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                  <AvatarImage
                    src={
                      selectedBooking.userId?.profile_image ||
                      "/placeholder.svg?height=64&width=64" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={selectedBooking.userId?.name || "Guest"}
                  />
                  <AvatarFallback className="text-lg bg-purple-100 text-purple-600">
                    {selectedBooking.userId?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "G"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                    selectedBooking.status === "approved"
                      ? "bg-green-500"
                      : selectedBooking.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                ></div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{selectedBooking.userId?.name || "Guest"}</h4>
                <div className="flex flex-wrap items-center mt-1 gap-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1 text-purple-500" />
                    <span className="text-sm">{selectedBooking.userId?.email || "No email provided"}</span>
                  </div>
                  {selectedBooking.userId?.phonenumber && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-1 text-purple-500" />
                      <span className="text-sm">{selectedBooking.userId?.phonenumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Booking Details */}
            <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
              <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
                <h5 className="font-semibold text-purple-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Booking Information
                </h5>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Booking Date</p>
                    <p className="font-medium text-gray-800">{formatBookingDate(selectedBooking.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Booking Time</p>
                    <p className="font-medium text-gray-800">{formatTime(selectedBooking.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Booking ID</p>
                    <p className="font-medium text-gray-800 break-all">{selectedBooking.tour_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                <h5 className="font-semibold text-green-700 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Information
                </h5>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Number of Guests</p>
                    <p className="font-medium text-gray-800">
                      {selectedBooking.bookingSit} {selectedBooking.bookingSit === 1 ? "person" : "people"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Total Amount</p>
                    <p className="font-medium text-gray-800">${selectedBooking.bookingTotal?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Bookings Section */}
          {bookings && bookings.length > 1 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Other Bookings by This Guest
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.slice(0, 3).map((relatedBooking, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                        <p className="text-xs font-medium text-gray-500">
                          {formatBookingDate(relatedBooking.createdAt)}
                        </p>
                      </div>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          relatedBooking.status === "approved"
                            ? "bg-green-500"
                            : relatedBooking.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>

                    <div className="flex justify-between mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm font-medium">{relatedBooking.bookingSit}</p>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm font-medium">${relatedBooking.bookingTotal?.toLocaleString() || 0}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(relatedBooking)}
                      className="w-full mt-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm text-purple-600 rounded flex items-center justify-center transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
            <button
              onClick={closeDetailCard}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {selectedBooking.status === "pending" && (
              <>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
