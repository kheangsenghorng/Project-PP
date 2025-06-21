"use client";

import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
const TourDetailsGuest = () => {
    const [participants, setParticipants] = useState([]); // State to hold participants data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state

    return (
        <div className="bg-white border-2 px-6 pb-6 rounded-lg flex-1 overflow-y-auto h-[428px] overflow-x-hidden">
        <div className="text-2xl font-semibold bg-white pb-4 pt-6 sticky top-0 flex items-center space-x-2">
            <h1>Participants List</h1>
            <BiEditAlt className="text-xl cursor-pointer" />
        </div>
        <div className="rounded-lg overflow-hidden border-x border-t border-gray-200">
            {loading ? (
                <p>Loading participants...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : participants.length > 0 ? (
                <table className="w-full table-fixed border-collapse ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b border-gray-200 p-2 text-left">Name</th>
                            <th className="border-b border-l p-2 text-left w-1/2">Email</th>
                            <th className="border-b border-l p-2 text-left">Action</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {participants.map((participant, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50">
                                <td className="border-b p-2 text-nowrap">{participant.username}</td>
                                <td className="border-b border-l p-2 truncate w-1/2">{participant.email}</td>
                                <td className="border-b border-l p-2 text-center">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        View
                                    </button>
                                </td>
                            </tr>
                            
                            
                        ))}
                    </tbody> */}
                </table>
            ) : (
                <p>No participants found for this tour.</p>
            )}
        </div>
    </div>
    );
  };
  
  export default TourDetailsGuest;
  