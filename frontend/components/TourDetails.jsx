"use client";


import  {CiSearch}  from "react-icons/ci";
import { FaUserSecret } from "react-icons/fa6";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";

const TourDetails =()=>{
    const participants = Array.from({ length: 16 }, (_, index) => ({
        name: `User ${index + 1}`,
        email: `participant${index + 1}@example.com`,
      }));

    const itinerary = [
    { day: "Day 1", description: "Arrival and welcome dinner" },
    { day: "Day 2", description: "Morning safari and lunch by the river" },
    { day: "Day 3", description: "Exploring local villages" },
    ];

    const destinations = [
    { name: "Safari Park", location: "Kenya", order: 1 },
    { name: "City Tour", location: "Nairobi", order: 2 },
    ];
     return (
        <div className="h-screen space-y-5 bg-[#F5F6FA]">
        <div className="sticky top-0 z-10">
            <div className="flex p-10 items-center h-16 justify-between bg-white">
                <div className="bg-gray-50 flex items-center border rounded-full p-1 pl-3 w-64 border-[#D5D5D5]">
                    <CiSearch className="text-gray-500 mr-2" />
                    <input className="flex-grow outline-none bg-gray-50" type="text" placeholder="Search" />
                </div>

                <div className="flex items-center space-x-6">
                    <FaBell className="h-7 w-7"/>
                    <div className="flex space-x-5 items-center">
                        <FaUserSecret className="h-8 w-8"/>
                        <div className="text-sm">
                            <h1>Gus Fring</h1>
                            <h1>Admin</h1>
                        </div>
                        <IoIosArrowDropdown className="text-[#5C5C5C] h-4 w-4 cursor-pointer"/>
                    </div>
                </div>
            </div>

            <div className="px-10 space-y-2 bg-[#F5F6FA] ">
                <div className="flex items-center h-16 justify-between ">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-3xl font-semibold">Tour Details</h1>
                        <BiEditAlt className="text-xl cursor-pointer" />
                    </div>
                    <div className="bg-gray-50 flex items-center border rounded-full p-1 pl-3 w-64 border-[#D5D5D5]">
                        <CiSearch className="text-gray-500 mr-2" />
                        <input className="flex-grow outline-none bg-gray-50" type="text" placeholder="Search" />
                    </div>
                </div>
            </div>
        </div> 

       
        <div className="flex mx-10 space-x-6">
            <div className="bg-white border-2 p-6  rounded-lg w-fit space-y-6 h-fit">
                <div className="flex justify-between">
                    <div className="space-x-16 flex">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-[#7E92A2] text-sm font-medium">Tour Name:</h1>
                                <h1 className="text-[#495560] font-semibold">Amazon Tour</h1>
                            </div>
                            <div>
                                <h1 className="text-[#7E92A2] text-sm font-medium">Stated Date:</h1>
                                <h1 className="text-[#495560] font-semibold">February 21, 2024</h1>
                            </div>
                            <div>
                                <h1 className="text-[#7E92A2] text-sm font-medium">Maximum Participants:</h1>
                                <h1 className="text-[#495560] font-semibold">16/20</h1>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-[#7E92A2] text-sm font-medium">Created At:</h1>
                                <h1 className="text-[#495560] font-semibold">November 17 2023</h1>
                            </div>
                            <div>
                                <h1 className="text-[#7E92A2] text-sm font-medium">End Date:</h1>
                                <h1 className="text-[#495560] font-semibold">February 21, 2024</h1>
                            </div>
                            <div>
                                <h1 className="text-[#7E92A2] text-sm font-medium">Price:</h1>
                                <h1 className="text-[#495560] font-semibold">$26</h1>
                            </div>
                        </div>                    
                    </div>
                    <img className="w-auto h-48 rounded-xl"
                    src="https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIxNDAxNTkxMDMzODE2NDY0MA%3D%3D/original/c1a97250-bd4f-4faf-9cd2-70fff05f5c2c.jpeg?im_w=1440&im_format=avif" alt="" />
                </div>
                <div className="w-[672.150px]">
                    <h1 className="text-[#7E92A2] text-sm font-medium">Overview:</h1>
                    <h1 className="text-[#495560] font-semibold text-wrap">Enjoy a seamless journey from Las Vegas to the stunning Grand Canyon West, one of the most iconic destinations in the world. Relax in an air-conditioned vehicle and spend your day marveling at the awe-inspiring views from Eagle Point and Guano Point, and immerse yourself in the rich culture of the Hualapai Tribe. For an even more unforgettable experience, customize your tour by adding a Grand Canyon Skywalk ticket, giving you a thrilling perspective over the canyon’s edge</h1>
                </div>
            </div>

            <div className="bg-white border-2 px-6 pb-6 rounded-lg flex-1 overflow-y-scroll h-[428px] overflow-x-hidden">
                <div className="text-2xl font-semibold bg-white pb-4 pt-6 sticky top-0 flex items-center space-x-2">
                        <h1>Participants List</h1>
                        <BiEditAlt className="text-xl cursor-pointer" />
                </div>
                <div className="rounded-lg overflow-hidden">
                    <table className="w-full table-fixed border-collapse border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-200 p-2 text-left">Name</th>
                                <th className="border border-gray-200 p-2 text-left w-1/2">Email</th>
                                <th className="border border-gray-200 p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant) => (
                                <tr key={participant.id} className="odd:bg-white even:bg-gray-50">
                                    <td className="border border-gray-200 p-2 text-nowrap">{participant.name}</td>
                                    <td className="border border-gray-200 p-2 truncate w-1/2">{participant.email}</td>
                                    <button className="px-4 py-2 border-b hover:underline w-fit">View</button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <div className="flex mx-10 space-x-6 pb-5">
            <div className="bg-white  px-6 pb-6 rounded-lg w-1/2 overflow-x-hidden">
                <div className="flex items-center space-x-5">
                    <div className="text-2xl font-semibold bg-white pb-4 pt-6 sticky top-0 flex items-center space-x-2">
                        <h1>Itinerary</h1>
                        <BiEditAlt className="text-xl cursor-pointer" />
                    </div>
                    
                </div>
                
                <div className="rounded-lg overflow-hidden">
                    <table className="w-full table-fixed border-collapse border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-200 p-2 text-left">Day</th>
                                <th className="border border-gray-200 p-2 text-left w-1/2">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itinerary.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="border border-gray-200 p-2 text-nowrap">{item.day}</td>
                                    <td className="border border-gray-200 p-2 truncate w-1/2">{item.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            <div className="bg-white  px-6 pb-6 rounded-lg w-1/2 overflow-x-hidden ">
                <div className="text-2xl font-semibold bg-white pb-4 pt-6 sticky top-0 flex items-center space-x-2">
                    <h1>Destinations</h1>
                    <BiEditAlt className="text-xl cursor-pointer" />
                </div>
                <div className="rounded-lg overflow-hidden">
                    <table className="w-full table-fixed border-collapse border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-200 p-2 text-left">Name</th>
                                <th className="border border-gray-200 p-2 text-left w-1/2">Location</th>
                                <th className="border border-gray-200 p-2 text-left">Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {destinations.map((destination, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="border border-gray-200 p-2 text-nowrap">{destination.name}</td>
                                    <td className="border border-gray-200 p-2 truncate w-1/2">{destination.location}</td>
                                    <td className="border border-gray-200 p-2 truncate w-1/2">{destination.order}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        
        
    </div>
     )
}

export default TourDetails;