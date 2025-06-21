const TourDetail = () => {
    return (
        <div className="px-10 bg-gray-50 h-screen overflow-y-auto">
          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Tour Name: Amazing Adventure</h1>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Available
              </span>
            </div>
    
            {/* Image Section */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://via.placeholder.com/400x250"
                alt="Tour Main"
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Gallery 1"
                  className="w-full h-32 object-cover rounded-md"
                />
                <img
                  src="https://via.placeholder.com/150"
                  alt="Gallery 2"
                  className="w-full h-32 object-cover rounded-md"
                />
                <img
                  src="https://via.placeholder.com/150"
                  alt="Gallery 3"
                  className="w-full h-32 object-cover rounded-md"
                />
                <img
                  src="https://via.placeholder.com/150"
                  alt="Gallery 4"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            </div>
    
            {/* Description Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">
                Experience the beauty of the mountains and the thrill of adventure
                with our Amazing Adventure tour. This package includes guided hikes,
                breathtaking views, and unforgettable memories.
              </p>
            </div>
    
            {/* Details Section */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Details</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>
                    <strong>Price:</strong> $500
                  </li>
                  <li>
                    <strong>Location:</strong> Mountain View, California
                  </li>
                  <li>
                    <strong>Duration:</strong> 3 Days, 2 Nights
                  </li>
                  <li>
                    <strong>Group Size:</strong> Up to 20 people
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Highlights</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>🌄 Stunning mountain views</li>
                  <li>🏕️ Camping under the stars</li>
                  <li>🍲 Delicious local cuisine</li>
                  <li>🏞️ Expert-guided tours</li>
                </ul>
              </div>
            </div>
    
            {/* Booking Section */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Interested in this tour?</h3>
                <p className="text-gray-500">Book now to secure your spot!</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Book Tour
              </button>
            </div>
          </div>
        </div>
      );
}