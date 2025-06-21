"use client"

import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";

function TourDetailsDetail({ id }) {

    const [destinations, setDestinations] = useState([]); // State to hold destinations data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state

    useEffect(() => {
        const fetchdestinations = async () => {
            const url = `http://localhost:5000/tours/${id}/destinations`; // Use the dynamic id to fetch destinations
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setDestinations(data); // Update state with the fetched participant data
            } catch (err) {
                setError(err.message); // Set the error message
            } finally {
                setLoading(false); // Stop loading state
            }
        };

        fetchdestinations(); // Fetch destinations on component mount
    }, [id]);


    return (
        <div className="bg-white px-6 pb-6 rounded-lg w-1/2 overflow-x-hidden">
            <div className="text-2xl font-semibold bg-white pb-4 pt-6 sticky top-0 flex items-center space-x-2">
                <h1>Destinations</h1>
                <BiEditAlt className="text-xl cursor-pointer" />
            </div>
            
            <div className="rounded-lg overflow-hidden border-x border-t border-gray-200">
                {loading ? (
                        <p>Loading destinations...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : destinations.length > 0 ? (
                    <table className="w-full table-fixed border-collapse ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border-b border-gray-200 p-2 text-left w-fit">Name</th>
                                <th className="border-b border-l border-gray-200 p-2 text-left w-fit">Location</th>
                                <th className="border-b border-l border-gray-200 p-2 text-left w-fit">Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {destinations.map((destination, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="border-b border-gray-200 p-2 text-nowrap w-fit">{destination.name}</td>
                                    <td className="border-b border-l border-gray-200 p-2 truncate w-fit ">{destination.location}</td>
                                    <td className="border-b border-l border-gray-200 p-2 truncate w-fit">{destination.order}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No destinations found for this tour.</p>
                )}
            </div>
        </div>
    );
}

export default TourDetailsDetail;
