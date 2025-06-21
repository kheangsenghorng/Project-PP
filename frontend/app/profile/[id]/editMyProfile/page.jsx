"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userStore } from "@/store/userStore";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { profileStore } from "@/store/profileStore";
import { Check, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAddressStore } from "@/store/addressStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCloudinaryUrl } from "@/utils/cloudinary";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export default function ProfilePage() {
  const param = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const { uploadProfileImage } = profileStore();
  const { user, loading, error, fetchUserById, editUser } = userStore();

  const {
    address,
    updateAddress,
    createAddress,
    loading: addressLoading,
    error: addressError,
    fetchAddress,
  } = useAddressStore();

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

  useEffect(() => {
    if (param.id) {
      fetchUserById(param.id);
      fetchAddress(param.id);
    }
  }, [param.id, fetchUserById, fetchAddress]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
      });
    }
  }, [user]);
  const imageUrl = getCloudinaryUrl(user?.profile_image);


  useEffect(() => {
    if (address) {
      setFormAddress({
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        street: address.street || "",
        zip: address.zip || "",
        homenumber: address.homenumber || "",
      });
    }
  }, [address]);

  const handleUserChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size should be less than 2MB");
        return;
      }
      setUploadError(null);
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setIsSuccess(false);
      setUploadError(null);

      await uploadProfileImage(param.id, selectedFile);
      await fetchUserById(param.id);

      setImageKey(Date.now());
      setPreviewImage(null);
      setIsSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error.message || "Failed to upload image");
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First update user data
      await editUser(param.id, formData);

      // Then handle address - create if doesn't exist, update if it does
      if (address) {
        await updateAddress(param.id, formAddress);
      } else {
        await createAddress(param.id, formAddress);
      }

      toast.success("Profile updated successfully");
      setTimeout(() => {
        router.push(`/profile/${param.id}/myprofile`);
      }, 4000);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };
  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;
  if (!user) return <p className="text-center py-8">No user found.</p>;

  return (
    <div className="flex-1 py-8">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <main>
          <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

          <div className="flex flex-col md:flex-row items-start mb-8 gap-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imageUrl && isValidUrl(imageUrl) ? (
                    <AvatarImage src={imageUrl} key={imageKey} />
                  ) : (
                    <AvatarFallback>
                      {user.firstname?.charAt(0) || "U"}
                      {user.lastname?.charAt(0) || "S"}
                    </AvatarFallback>
                  )}
                </Avatar>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
                {isSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/70 rounded-full">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>

              <div className="mt-4 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="profile-upload"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Photo
                </Button>
                {selectedFile && (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload Photo"
                      )}
                    </Button>
                    {uploadError && (
                      <p className="text-red-500 text-sm">{uploadError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {user.firstname || "N/A"} {user.lastname || "N/A"}
              </h2>
              <p className="text-gray-600">
                {user.email || "No email available"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    First Name*
                  </label>
                  <Input
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleUserChange}
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Last Name*
                  </label>
                  <Input
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleUserChange}
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleUserChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Phone Number*
                  </label>
                  <Input
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleUserChange}
                    required
                    type="tel"
                  />
                </div>
              </div>
            </section>

            {/* <section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Country*
                  </label>
                  <Input
                    name="country"
                    value={formAddress.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    City*
                  </label>
                  <Input
                    name="city"
                    value={formAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    State/Province
                  </label>
                  <Input
                    name="state"
                    value={formAddress.state}
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    ZIP Code*
                  </label>
                  <Input
                    name="zip"
                    value={formAddress.zip}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Street*
                  </label>
                  <Input
                    name="street"
                    value={formAddress.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Home Number*
                  </label>
                  <Input
                    name="homenumber"
                    value={formAddress.homenumber}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
            </section> */}

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  toast.info("Changes discarded", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  router.push(`/profile/${param.id}/myprofile`);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isUploading}
                onClick={() => {
                  if (!isUploading) {
                    toast.promise(
                      handleSubmit, // assuming handleSubmit returns a promise
                      {
                        pending: "Saving changes...",
                        success: "Profile updated successfully!",
                        error: "Failed to update profile",
                      },
                      {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      }
                    );
                  }
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
