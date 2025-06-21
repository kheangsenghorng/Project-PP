"use client";
import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";

const TourDetailsIteneray = () => {

    const [itinerary, setitinerary] = useState([]); // State to hold itinerary data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state


    return (
      <div className="bg-white px-6 pb-6 rounded-lg w-1/2 overflow-x-hidden">
            <div className="flex items-center space-x-5">
                <div className="text-2xl font-semibold bg-white pb-4 pt-6 sticky top-0 flex items-center space-x-2">
                    <h1>Itinerary</h1>
                    <BiEditAlt className="text-xl cursor-pointer"/>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden border-x border-t border-gray-200">
                {loading ? (
                        <p>Loading itinerary...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : itinerary.length > 0 ? (
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border-b border-gray-200 p-2 text-left">Day</th>
                                <th className="border-b border-l border-gray-200 p-2 text-left w-1/2">Description</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            {itinerary.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="border-b border-gray-200 p-2 text-nowrap">{item.day}</td>
                                    <td className="border-b border-l border-gray-200 p-2  w-1/2">{item.description}</td>
                                </tr>
                            ))}
                        </tbody> */}
                    </table>
                ) : (
                    <p>No itinerary found for this tour.</p>
                )}
            </div>
        </div>
    );
  };
  
  export default TourDetailsIteneray;