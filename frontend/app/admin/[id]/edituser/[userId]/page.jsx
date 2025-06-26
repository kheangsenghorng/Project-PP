"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard, MapPin, User, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";
import Image from "next/image";
import { profileStore } from "@/store/profileStore";
import { useAddressStore } from "@/store/addressStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTourHistoryStore } from "@/store/useTourHistoryStore";
import { getCloudinaryUrl } from "@/utils/cloudinary";

export default function Edituser() {
  const params = useParams();
  const router = useRouter();
  const { user, useById, loading, error, editUser, fetchUserByIdadmin } =
    userStore();
  const {
    profileImage,
    setProfileImage,
    fetchProfileImage,
    uploadProfileImage,
  } = profileStore();

  const {
    bookings,
    fetchBookings,
    isLoading,
    error: historyError,
  } = useTourHistoryStore();

  const {
    address,
    createAddress,
    loading: addressLoading,
    error: addressError,
    fetchAddress,
    updateAddress,
  } = useAddressStore();

  // Form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
  });

  const [formAddress, setFormAddress] = useState({
    city: "",
    state: "",
    country: "",
    street: "",
    zip: "",
    homenumber: "",
  });
  // Initialize form data when user and address are loaded
  useEffect(() => {
    if (useById) {
      setFormData((prevData) => ({
        ...prevData,
        firstname: useById.firstname || "",
        lastname: useById.lastname || "",
        email: useById.email || "",
        phonenumber: useById.phonenumber || "",
      }));
    }
  }, [useById]);
  const imageUrl = getCloudinaryUrl(useById?.profile_image);

  useEffect(() => {
    if (address) {
      setFormAddress((prevData) => ({
        ...prevData,
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        zip: address.zip || "",
        homenumber: address.homenumber || "",
      }));
    }
  }, [address]);

  useEffect(() => {
    if (params.userId) {
      fetchUserByIdadmin(params.id, params.userId);
      fetchAddress(params.userId);
      if (typeof params.userId === "string" && params.userId.trim() !== "") {
        fetchProfileImage(params.userId);
      } else {
        console.error("Invalid param.id:", params.userId);
      }
    }
  }, [params.userId, fetchUserByIdadmin, fetchProfileImage, fetchAddress]);

  useEffect(() => {
    if (params.userId) {
      fetchBookings(params.userId);
    }
  }, [params.userId]);

  // console.log("Bookings:", bookings);

  const totallength = bookings?.length;
  const tatalamount = bookings?.reduce(
    (total, booking) => total + (booking.total || 0),
    0
  );

  // Handle select changes
  const handleAddressChange = (e) => {
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });
  };
  const handleUserChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First update user data
      await editUser(params.userId, formData);

      // Then handle address - create if doesn't exist, update if it does
      if (address) {
        await updateAddress(params.userId, formAddress);
      } else {
        await createAddress(params.userId, formAddress);
      }
      toast.success("Profile updated successfully");
      setTimeout(() => {
        router.push(`/${params.id}/viewuser/${params.userId}`);
      }, 4000);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  // if (isLoading) return <p>Loading...</p>;
  // if (historyError) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Sidebar with user info */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                {/* <p>{user?.status}</p> */}
                <Avatar className="h-24 w-24">
                  <Image
                    src={
                      imageUrl ||
                      "https://www.gravatar.com/avatar/?d=mp&s=120" ||
                      "/placeholder.svg"
                    }
                    alt="User profile image"
                    layout="fill"
                  />
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className=" font-bold text-nowrap ">
                    {formData.firstname || "Unknown"}
                    {formData.lastname ? ` ${formData.lastname}` : ""}
                  </h2>
                  {/* <p className="text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formAddress.country || "Country"}
                    {formAddress.city ? `, ${formAddress.city}` : ""}
                  </p> */}
                </div>

                <div className="flex w-full justify-around text-center">
                  <div>
                    <p className="text-xl font-bold">{totallength}</p>
                    <p className="text-xs text-muted-foreground">Tours</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">${tatalamount}</p>
                    <p className="text-xs text-muted-foreground">Amount</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <CalendarDays className="h-4 w-4 mr-2" />
                Booking History
              </TabsTrigger>
              {/* <TabsTrigger value="payments">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment History
              </TabsTrigger> */}
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Edit your personal details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstname">First Name</Label>
                          <Input
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleUserChange}
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastname">Last Name</Label>
                          <Input
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleUserChange}
                            placeholder="Enter your last name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleUserChange}
                            placeholder="Enter your email"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phonenumber">Phone</Label>
                          <Input
                            id="phonenumber"
                            name="phonenumber"
                            value={formData.phonenumber}
                            onChange={handleUserChange}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {/* 
                        <div className="space-y-2">
                          <Label htmlFor="street">Street</Label>
                          <Input
                            id="street"
                            name="street"
                            value={formAddress.street}
                            onChange={handleAddressChange}
                            placeholder="Enter your street"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formAddress.city}
                            onChange={handleAddressChange}
                            placeholder="Enter your city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formAddress.state}
                            onChange={handleAddressChange}
                            placeholder="Enter your state"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formAddress.country}
                            onChange={handleAddressChange}
                            placeholder="Enter your country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip Code</Label>
                          <Input
                            id="zip"
                            name="zip"
                            value={formAddress.zip}
                            onChange={handleAddressChange}
                            placeholder="Enter your zip code"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="homenumber">Home Number</Label>
                          <Input
                            id="homenumber"
                            name="homenumber"
                            value={formAddress.homenumber}
                            onChange={handleAddressChange}
                            placeholder="Enter your home number"
                          />
                        </div> */}
                      </div>

                      <div className="pt-4">
                        <Label className="text-sm font-medium text-muted-foreground mb-2">
                          Travel Preferences
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">Adventure</Badge>
                          <Badge variant="outline">Cultural</Badge>
                          <Badge variant="outline">Beach</Badge>
                          <Badge variant="outline">Food & Wine</Badge>
                          <Badge variant="outline">Luxury</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            {/* Booking History Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                  <CardDescription>
                    View all your past and upcoming tour bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {bookings.map((booking, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {booking.tourId?.tour_name || "Tour Booking"}
                            </h3>
                            <p className="text-muted-foreground">
                              Booking ID: {booking.bookingId || "N/A"}
                            </p>
                          </div>
                          {/* <Badge className="bg-blue-500">Upcoming</Badge> */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Dates
                            </h4>
                            <p>
                              {new Date(booking?.date?.[0]).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                              {" - "}
                              {new Date(booking?.date?.[1]).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Seat
                            </h4>
                            <p>{booking?.sit}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Total
                            </h4>
                            <p>${booking?.total}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment History Tab */}
            {/* <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View all your payment transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Date</th>
                            <th className="text-left py-3 px-2">Description</th>
                            <th className="text-left py-3 px-2">Method</th>
                            <th className="text-right py-3 px-2">Amount</th>
                            <th className="text-right py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-2">May 2, 2024</td>
                            <td className="py-3 px-2">
                              Bali Paradise Tour Deposit
                            </td>
                            <td className="py-3 px-2">Visa •••• 4242</td>
                            <td className="py-3 px-2 text-right">$500.00</td>
                            <td className="py-3 px-2 text-right">
                              <Badge className="bg-green-500">Paid</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-2">Aug 15, 2023</td>
                            <td className="py-3 px-2">
                              European Heritage Tour Final Payment
                            </td>
                            <td className="py-3 px-2">Mastercard •••• 5678</td>
                            <td className="py-3 px-2 text-right">$3,850.00</td>
                            <td className="py-3 px-2 text-right">
                              <Badge className="bg-green-500">Paid</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-2">Jul 1, 2023</td>
                            <td className="py-3 px-2">
                              European Heritage Tour Deposit
                            </td>
                            <td className="py-3 px-2">Mastercard •••• 5678</td>
                            <td className="py-3 px-2 text-right">$1,000.00</td>
                            <td className="py-3 px-2 text-right">
                              <Badge className="bg-green-500">Paid</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-2">Feb 10, 2023</td>
                            <td className="py-3 px-2">African Safari Refund</td>
                            <td className="py-3 px-2">Visa •••• 4242</td>
                            <td className="py-3 px-2 text-right">$3,200.00</td>
                            <td className="py-3 px-2 text-right">
                              <Badge className="bg-blue-500">Refunded</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-2">Jan 5, 2023</td>
                            <td className="py-3 px-2">
                              African Safari Deposit
                            </td>
                            <td className="py-3 px-2">Visa •••• 4242</td>
                            <td className="py-3 px-2 text-right">$1,000.00</td>
                            <td className="py-3 px-2 text-right">
                              <Badge
                                variant="outline"
                                className="text-red-500 border-red-500"
                              >
                                Cancelled
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Payment Methods
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-muted-foreground">
                                Expires 05/25
                              </p>
                            </div>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-medium">
                                Mastercard ending in 5678
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires 12/24
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
