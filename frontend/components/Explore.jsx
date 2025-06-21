import Link from "next/link";

export default function Explore() {
  return (
    <div className="w-[1200px] mx-auto">
      {/* Menu Section */}
      <div className="container mx-auto p-3">
        <div className="bg-white p-6 border rounded-lg">
          <div className="flex gap-10">
            {/* Explore Link */}
            <Link href="#Explore">
              <div className="text-xl text-blue-600 underline hover:text-blue-800 cursor-pointer">
                Overview
              </div>
            </Link>

            {/* Rooms Link */}
            <Link href="#Itinerary">
              <div className="text-xl underline text-gray-600 hover:text-blue-800 cursor-pointer">
                Itinerary
              </div>
            </Link>

            {/* Itinerary Link */}
            <Link href="#Rooms">
              <div className="text-xl underline text-gray-600 hover:text-blue-800 cursor-pointer">
                Additional Info
              </div>
            </Link>
            {/* Itinerary Link */}
            <Link href="#Review">
              <div className="text-xl underline text-gray-600 hover:text-blue-800 cursor-pointer">
                Review
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
