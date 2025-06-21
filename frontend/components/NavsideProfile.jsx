"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const NavsideProfile = ({ children }) => {
  const { id } = useParams();
  const pathname = usePathname();

  // Helper function to check active route
  const isActive = (href) => pathname === href;

  return (
    <div className="flex py-24">
      <div className="w-64 bg-white shadow-md">
        <div className="py-4 px-6">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        </div>
        <nav className="mt-2">
          <Link
            href={`/profile/${id}/myprofile`}
            className={`flex items-center px-6 py-4 ${
              isActive(`/profile/${id}/myprofile`)
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            My Profile
          </Link>

          <Link
            href={`/profile/${id}/notication`}
            className={`flex items-center px-6 py-4 ${
              isActive(`/profile/${id}/notication`)
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Notification
          </Link>

          <Link
            href={`/profile/${id}/historypayment`}
            className={`flex items-center px-6 py-4 ${
              isActive(`/profile/${id}/historypayment`)
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            History payment
          </Link>

          <Link
            href={`/profile/${id}/help-support`}
            className={`flex items-center px-6 py-4 ${
              isActive(`/profile/${id}/help-support`)
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Help & Support
          </Link>

          <Link
            href={`/profile/${id}/favorite`}
            className={`flex items-center px-6 py-4 ${
              isActive(`/profile/${id}/favorite`)
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            Favorite
          </Link>

          <Link
            href={`/profile/${id}/feedback`}
            className={`flex items-center px-6 py-4 ${
              isActive(`/profile/${id}/feedback`)
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            Feedback
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-6 bg-gray-50">{children}</div>
    </div>
  );
};

export default NavsideProfile;
