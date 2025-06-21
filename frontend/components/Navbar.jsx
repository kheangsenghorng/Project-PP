// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { createPortal } from "react-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { userStore } from "@/store/userStore";
// import { useParams, useRouter } from "next/navigation";

// export default function Navbar() {
//   const { id } = useParams();
//   const router = useRouter(); // Initialize useRouter
//   const [isOpen, setIsOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const { user, loading, error, fetchUserById, logout } = userStore();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     if (id) {
//       setIsLoggedIn(true);
//     }
//   }, [id]);

//   const handleLogout = async () => {
//     await logout(); // Call Zustand logout function
//     router.push("/login"); // Redirect to login page
//   };

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isOpen &&
//         !document.getElementById("dropdown-menu")?.contains(event.target) &&
//         !document.getElementById("hamburger-btn")?.contains(event.target)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <>
//       <nav className="bg-white shadow-md h-[80px] md:h-[100px] fixed top-0 left-0 w-full z-50">
//         <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-full">
//           <div className="flex items-center h-full">
//             <img
//               src="/image/logo-edit.png"
//               alt="Travel With Us"
//               className="h-[80px] md:h-[160px] w-auto object-contain"
//             />
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-7">
//             <Link
//               href={id ? `/${id}/` : "/"}
//               className="text-green-700 hover:text-green-900 flex items-center space-x-2"
//             >
//               <i className="fa-solid fa-house"></i>
//               <span>Home</span>
//             </Link>
//             <Link
//               href={id ? `/${id}/about` : "/about"}
//               className="text-green-700 hover:text-green-900 flex items-center space-x-2"
//             >
//               <i className="fa-solid fa-users"></i>
//               <span>About</span>
//             </Link>
//             <Link
//               href={id ? `/${id}/contact` : "/contact"}
//               className="text-green-700 hover:text-green-900 flex items-center space-x-2"
//             >
//               <i className="fa-solid fa-phone"></i>
//               <span>Contact</span>
//             </Link>
//           </div>

//           {/* Buttons */}
//           <div className="hidden md:flex space-x-2">
//             <Link
//               href="#"
//               className="border-2 border-yellow-500 text-yellow-500 py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-white flex items-center space-x-2"
//             >
//               <i className="fa-solid fa-b"></i>
//               <span>Booking Now</span>
//             </Link>
//             <Link
//               href="/login"
//               className="text-green-700 py-2 px-4 border border-green-700 rounded-md hover:bg-green-700 hover:text-white flex items-center space-x-2"
//             >
//               <i className="fas fa-sign-in"></i>
//               <span>Login</span>
//             </Link>
//             <Link
//               href="/register"
//               className="text-green-700 py-2 px-4 border border-green-700 rounded-md hover:bg-green-700 hover:text-white flex items-center space-x-2"
//             >
//               <i className="fa-solid fa-registered"></i>
//               <span>Register</span>
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             id="hamburger-btn"
//             className="md:hidden text-green-700 text-2xl"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Dropdown Menu - Uses React Portal */}
//       {mounted &&
//         createPortal(
//           isOpen && (
//             <div
//               id="dropdown-menu"
//               className="fixed top-[80px] left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-3 z-40"
//             >
//               <Link
//                 href="/"
//                 className="text-green-700 flex items-center space-x-2"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <i className="fa-solid fa-house"></i>
//                 <span>Home</span>
//               </Link>
//               <Link
//                 href="/about"
//                 className="text-green-700 flex items-center space-x-2"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <i className="fa-solid fa-users"></i>
//                 <span>About</span>
//               </Link>
//               <Link
//                 href="/contact"
//                 className="text-green-700 flex items-center space-x-2"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <i className="fa-solid fa-phone"></i>
//                 <span>Contact</span>
//               </Link>
//               <hr className="border-gray-300" />
//               <Link
//                 href="#"
//                 className="text-yellow-500 flex items-center space-x-2 border-2 border-yellow-500 py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-white"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <i className="fa-solid fa-b"></i>
//                 <span>Booking Now</span>
//               </Link>
//               <Link
//                 href="/login"
//                 className="text-green-700 flex items-center space-x-2 border border-green-700 py-2 px-4 rounded-md hover:bg-green-700 hover:text-white"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <i className="fas fa-sign-in"></i>
//                 <span>Login</span>
//               </Link>
//               <Link
//                 href="/register"
//                 className="text-green-700 flex items-center space-x-2 border border-green-700 py-2 px-4 rounded-md hover:bg-green-700 hover:text-white"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <i className="fa-solid fa-registered"></i>
//                 <span>Register</span>
//               </Link>
//             </div>
//           ),
//           document.body // Renders dropdown outside the navbar
//         )}
//     </>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { userStore } from "@/store/userStore";

export default function Navbar() {
  const { id } = useParams();
  const router = useRouter();
  const { user, logout } = userStore();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoggedIn(true);
    }
  }, [id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-md h-[80px] md:h-[100px] fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-full">
          {/* Logo */}
          <Link href={id ? `/tour/${id}/` : "/"}>
            <img
              src="/image/logo-edit.png"
              alt="Travel With Us"
              className="h-[80px] md:h-[160px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-7">
            <NavItem
              href={id ? `/tour/${id}/` : "/"}
              icon="fa-house"
              label="Home"
            />
            <NavItem
              href={id ? `/tour/${id}/about` : "/tourpage/about"}
              icon="fa-users"
              label="About"
            />
            <NavItem
              href={id ? `/tour/${id}/contact` : "/tourpage/contact"}
              icon="fa-phone"
              label="Contact"
            />
          </div>

          {/* Buttons */}
          <div className="hidden md:flex space-x-2">
            {isLoggedIn ? (
              <>
                <NavButton
                  href={`/tour/${id}/list-tour`}
                  icon="fa-calendar-check"
                  label="Booking Now"
                />
                <NavButton
                  href={`/profile/${id}/myprofile`}
                  icon="fa-user"
                  label="Profile"
                />
                <button
                  onClick={handleLogout}
                  className="text-green-700 py-2 px-4 border border-green-700 rounded-md hover:bg-green-700 hover:text-white flex items-center space-x-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavButton href="/login" icon="fa-sign-in-alt" label="Login" />
                <NavButton
                  href="/register"
                  icon="fa-registered"
                  label="Register"
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            id="hamburger-btn"
            className="md:hidden text-green-700 text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu - Uses React Portal */}
      {mounted &&
        createPortal(
          isOpen && (
            <div
              id="dropdown-menu"
              className="fixed top-[80px] left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-3 z-40"
            >
              <NavItem
                href="/"
                icon="fa-house"
                label="Home"
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                href="/tourpage/about"
                icon="fa-users"
                label="About"
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                href="/tourpage/contact"
                icon="fa-phone"
                label="Contact"
                onClick={() => setIsOpen(false)}
              />
              <hr className="border-gray-300" />
              {isLoggedIn ? (
                <>
                  <NavButton
                    href={`/tour/${id}/list-tour`}
                    icon="fa-calendar-check"
                    label="Booking Now"
                    onClick={() => setIsOpen(false)}
                  />
                  <NavButton
                    href={`/profile/${id}/myprofile`}
                    icon="fa-user"
                    label="Profile"
                    onClick={() => setIsOpen(false)}
                  />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-green-700 flex items-center space-x-2 border border-green-700 py-2 px-4 rounded-md hover:bg-green-700 hover:text-white"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavButton
                    href="/login"
                    icon="fa-sign-in-alt"
                    label="Login"
                    onClick={() => setIsOpen(false)}
                  />
                  <NavButton
                    href="/register"
                    icon="fa-registered"
                    label="Register"
                    onClick={() => setIsOpen(false)}
                  />
                </>
              )}
            </div>
          ),
          document.body
        )}
    </>
  );
}

// Component for Nav Items
const NavItem = ({ href, icon, label, onClick }) => (
  <Link
    href={href}
    className="text-green-700 hover:text-green-900 flex items-center space-x-2"
    onClick={onClick}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span>{label}</span>
  </Link>
);

// Component for Buttons
const NavButton = ({ href, icon, label, onClick }) => (
  <Link
    href={href}
    className="text-green-700 py-2 px-4 border border-green-700 rounded-md hover:bg-green-700 hover:text-white flex items-center space-x-2"
    onClick={onClick}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span>{label}</span>
  </Link>
);
