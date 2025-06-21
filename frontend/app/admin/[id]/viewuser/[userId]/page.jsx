"use client";

import Image from "next/image";
import { Calendar, Pencil, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";
// import { profileStore } from "@/store/profileStore";
import { useAddressStore } from "@/store/addressStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import Link from "next/link";
import { getCloudinaryUrl } from "@/utils/cloudinary";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { useById, loading, error, fetchUserById, fetchUserByIdadmin } =
    userStore();
  // const { profileImage, fetchProfileImage } = profileStore();
  const { address, fetchAddress } = useAddressStore();

  // // Sample tour history data
  // const tourHistory = [
  //   {
  //     id: 1,
  //     name: "Beach Paradise Tour",
  //     image: "/placeholder.svg",
  //     bookedDate: "January 10, 2025",
  //     status: "Completed",
  //     price: "$499",
  //     startDate: "February 5, 2025",
  //     endDate: "February 10, 2025",
  //   }, 
  //   {
  //     id: 2,
  //     name: "City Discovery Tour",
  //     image: "/placeholder.svg",
  //     bookedDate: "November 20, 2024",
  //     status: "Completed",
  //     price: "$349",
  //     startDate: "December 15, 2024",
  //     endDate: "December 18, 2024",
  //   },
  // ];

  useEffect(() => {
    if (params.id && params.userId) {
      fetchUserByIdadmin(params.id, params.userId);
      fetchAddress(params.userId);
    }
  }, [params.id, params.userId, fetchUserByIdadmin, fetchAddress]);

  const imageUrl = getCloudinaryUrl(useById?.profile_image);
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={imageUrl || "https://www.gravatar.com/avatar/?d=mp&s=120"}
                alt={`${useById?.firstname || "User"} ${
                  useById?.lastname || ""
                }`}
              />
              <AvatarFallback>
                {useById?.firstname?.charAt(0) || "U"}
                {useById?.lastname?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-medium text-lg">
                {useById?.firstname || "Unknown"} {useById?.lastname || "User"}
              </h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {useById?.status?.charAt(0).toUpperCase() +
                    useById?.status?.slice(1) || "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Manage your personal details and preferences
                    </CardDescription>
                  </div>
                  <Link
                    href={`/admin/${params.id}/edituser/${params.userId}`}
                    className="px-3 py-2 border border-gray-300 rounded text-sm flex items-center hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </h3>
                      <p className="text-base">
                        {useById?.firstname || "N/A"}{" "}
                        {useById?.lastname || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Email
                      </h3>
                      <p className="text-base text-wrap">
                        {useById?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Phone
                      </h3>
                      <p className="text-base">
                        {useById?.phonenumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Travel Preferences
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Adventure</Badge>
                      <Badge variant="outline">Cultural</Badge>
                      <Badge variant="outline">Beach</Badge>
                      <Badge variant="outline">Food & Wine</Badge>
                      <Badge variant="outline">Luxury</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">User Tour History</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booked Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tourHistory.map((tour) => (
                <tr key={tour.id}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <Link
                      href={`/${params.id}/booking/bookingtour/${1}/${
                        params.userId
                      }`}
                    >
                      <div className="relative w-20 h-15">
                        <Image
                          src={tour.image}
                          alt={`${tour.name} thumbnail`}
                          width={80}
                          height={60}
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 text-sm font-medium text-gray-900">
                        {tour.name}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tour.bookedDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tour.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tour.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tour.startDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tour.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
