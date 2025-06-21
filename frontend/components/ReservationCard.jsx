export default function ReservationCard({ hotelName, bookingDate, duration, price, image }) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex">
        <div className="w-24 h-24 overflow-hidden rounded-lg mr-4 flex-shrink-0">
          <img src={image || "/placeholder.svg"} alt={hotelName} className="w-full h-full object-cover" />
        </div>
  
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{hotelName}</h3>
          <div className="flex flex-col sm:flex-row sm:justify-between mt-1">
            <div className="text-sm text-gray-600">
              <p>Booking: {bookingDate}</p>
              <p>Duration: {duration}</p>
            </div>
            <p className="font-bold mt-1 sm:mt-0">{price}$</p>
          </div>
        </div>
  
        <div className="ml-4 flex items-center">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-full text-sm whitespace-nowrap">
            Cancel Reservation
          </button>
        </div>
      </div>
    )
  }
  
  