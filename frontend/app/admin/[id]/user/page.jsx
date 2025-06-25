"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCopy, faPen } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { profileStore } from "@/store/profileStore";
import Image from "next/image";
import Link from "next/link";
import { userStore } from "@/store/userStore";
import { getCloudinaryUrl } from "@/utils/cloudinary";

const UserPage = () => {
  const params = useParams();
  const { users, fetchProfileImage, fetchUsers, loading, error } =
    profileStore();

  const { user, fetchUserById, editUser } = userStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUser, setHoveredUser] = useState(null);
  const usersPerPage = 8;

  const [formData, setFormData] = useState({
    status: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        status: user.status || "",
      }));
    }
  }, [user]);

  // Fix: Properly update formData when status changes
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Update the user status in the backend
      await editUser(userId, { status: newStatus });

      // Update the local state to reflect the change immediately
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      );

      // Assuming you have a way to update the users in your store
      // This might need adjustment based on your actual store implementation
      fetchUsers(params.id); // Refresh the user list
    } catch (error) {
      console.error("Failed to update user status:", error);
      // You might want to show an error message to the user here
    }
  };
  useEffect(() => {
    if (params.id) {
      fetchUsers(params.id);
    }
  }, [params.id, fetchUsers]);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        `${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );
  // const imageUrl = getCloudinaryUrl(currentUsers?.user?.profile_image);

  // ✅ Green spinner loading screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-green-500 border-gray-200"></div>
        <p className="mt-6 text-lg text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-700">User Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by user name"
                className="pl-10 pr-4 py-2 border rounded-lg w-64 md:w-96"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-[20px] h-[20px]"
              />
            </div>
            <Link
              href={`/admin/${params.id}/adduser`}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add User
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Hover card positioned above the table body */}
          {/* {hoveredUser && (
            <div className="absolute ml-7 top-10 left-1/2 max-md:left-16 transform -translate-x-1/2 z-10 w-72 mb-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <Image
                        src={
                          hoveredUser.profile_image_url ||
                          "https://www.gravatar.com/avatar/?d=mp&s=120"
                        }
                        alt="User profile image"
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="space-y-1 text-center">
                      <h2 className="text-2xl font-bold">
                        {hoveredUser.firstname} {hoveredUser.lastname}
                      </h2>
                      <p className="text-muted-foreground flex items-center justify-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {hoveredUser.location || "Location not specified"}
                      </p>
                    </div>
                    <div className="flex w-full justify-around text-center">
                      <div>
                        <p className="text-xl font-bold">
                          {hoveredUser.tours || "0"}
                        </p>
                        <p className="text-xs text-muted-foreground">Tours</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">
                          {hoveredUser.countries || "0"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Countries
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">
                          {hoveredUser.years || "0"}
                        </p>
                        <p className="text-xs text-muted-foreground">Years</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )} */}

          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-red-500">
                    Error loading users
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, i) => {
                  const imageUrl = user?.profile_image
                    ? getCloudinaryUrl(user.profile_image)
                    : "https://www.gravatar.com/avatar/?d=mp&s=120";

                  return (
                    <tr
                      key={user._id}
                      className="border-t text-nowrap hover:bg-gray-50"
                      onMouseEnter={() => setHoveredUser(user)}
                      onMouseLeave={() => setHoveredUser(null)}
                    >
                      <td className="px-4 py-3">#{startIndex + i + 1000}</td>
                      <td className="px-4 py-3">
                        <div className="relative w-10 h-10">
                          {user?.isVerified && (
                            <span className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md z-10">
                              ✔
                            </span>
                          )}
                          <Link
                            href={`/admin/${params.id}/viewuser/${user._id}`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={imageUrl}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/${params.id}/viewuser/${user._id}`}
                          className="hover:underline"
                        >
                          {user.lastname} {user.firstname}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{user.email || "N/A"}</td>
                      <td className="px-4 py-3">{user.phonenumber || "N/A"}</td>
                      <td className="px-4 py-3">
                        <select
                          className={`px-3 py-1 text-xs font-medium rounded-full border outline-none transition-all duration-200
              ${
                user.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
                  : user.status === "approved"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-600 text-white border-red-500 hover:bg-red-700"
              }`}
                          value={user.status}
                          onChange={(e) =>
                            handleStatusChange(user._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">
                        {user.joined_date
                          ? new Date(user.joined_date)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          className="p-1 hover:text-blue-500"
                          title="Copy user details"
                        >
                          <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/${params.id}/edituser/${user._id}`}
                          className="p-1 hover:text-blue-500"
                          title="Edit user"
                        >
                          <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredUsers.length > usersPerPage && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 border rounded bg-blue-50 text-blue-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
