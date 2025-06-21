"use client";
import Link from "next/link";
import Image from "next/image";
import { PenSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";
import { profileStore } from "@/store/profileStore";
import { useAddressStore } from "@/store/addressStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCloudinaryUrl } from "@/utils/cloudinary";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading, error, fetchUserById } = userStore();
  // const { profileImage, fetchProfileImage } = profileStore();
  const {
    address,
    loading: addressLoading,
    error: addressError,
    fetchAddress,
  } = useAddressStore();

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        toast.dismiss("loading");
      }, 5000);
    } else {
      toast.dismiss("loading");
    }

    return () => {
      toast.dismiss("loading");
    };
  }, [loading]);

  useEffect(() => {
    if (error) {
      toast.error("User not found");
      const timer = setTimeout(() => router.push("not-found"));
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  useEffect(() => {
    if (!user && !loading) {
      toast.error("No user data available");
    }
  }, [user, loading]);

  const imageUrl = getCloudinaryUrl(user?.profile_image);


  // useEffect(() => {
  //   if (addressError) {
  //     toast.error("Failed to load address");
  //   }
  // }, [addressError]);

  useEffect(() => {
    if (!params.id) return;

    const loadData = async () => {
      try {
        await fetchUserById(params.id);
        await fetchAddress(params.id);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }
    };

    loadData();
  }, [params.id, fetchUserById, fetchAddress]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <ToastContainer
          position="top-right"
          autoClose={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>No user found.</p>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
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

      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      <div className="flex items-center mb-8">
        <div className="flex relative">
          <Avatar className="h-24 w-24 relative">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt="User profile image" />
            ) : (
              <AvatarFallback>
                {user.firstname?.charAt(0) || "U"}
                {user.lastname?.charAt(0) || "S"}
              </AvatarFallback>
            )}

            {/* ✅ Verified badge on profileImage */}
            {user?.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full text-xs shadow-md">
                ✔
              </span>
            )}
          </Avatar>

          <main className="flex flex-col justify-center ml-4">
            <h2 className="mt-4 text-xl font-semibold uppercase">
              {user?.firstname || "N/A"} <span>{user?.lastname || "N/A"}</span>
            </h2>
            <p className="text-gray-600">
              {user?.email || "No email available"}
            </p>
          </main>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Link href={`/profile/${params.id}/editMyProfile`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 flex items-center gap-2 transition-colors">
            Edit Profile
            <PenSquare className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              First Name
            </label>
            <div className="text-gray-900">{user?.firstname || "N/A"}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Last Name
            </label>
            <div className="text-gray-900">{user?.lastname || "N/A"}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <div className="text-gray-900">{user?.email || "N/A"}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <div className="text-gray-900">{user?.phonenumber || "N/A"}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Bio</label>
            <div className="text-gray-900">{user?.bio || "No bio yet"}</div>
          </div>
        </div>
      </div>

      {/* Address
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        {addressLoading && <p>Loading address...</p>}
        {addressError}

        {address ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Country
              </label>
              <div className="text-gray-900">{address?.country || "N/A"}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                City/State
              </label>
              <div className="text-gray-900">
                {address?.city || "N/A"} {address?.state || "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                ZIP Code
              </label>
              <div className="text-gray-900">{address?.zip || "N/A"}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Street</label>
              <div className="text-gray-900">{address?.street || "N/A"}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Home Number
              </label>
              <div className="text-gray-900">
                {address?.homenumber || "N/A"}
              </div>
            </div>
          </div>
        ) : (
          !addressLoading && <p>No address found</p>
        )}
      </div> */}
    </div>
  );
};

export default Page;
