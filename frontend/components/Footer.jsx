"use client";
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left items-center py-8">
          {/* Left Column: Navigation Links */}
          <div className="mx-auto">
            <ul className="flex flex-wrap justify-center md:justify-start gap-4">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  FAQ/Help
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  FAQ/Help
                </a>
              </li>
            </ul>
            {/* Center Column: Logo */}
            <div className="md:mt-8">
              <img
                src="/image/logo-edit.png" // Ensure this path is correct
                alt="Logo"
                className="mx-auto w-[210px] h-[210px]"
              />
            </div>
          </div>

          {/* Right Column: Contact and Social Media */}
          <div>
            <div className="py-2">
              <p className="text-gray-700">
                <i className="fas fa-map-marker-alt text-green-600"></i> Royal
                University Of Phnom Penh, Faculty Engineering, Department ITE
              </p>
            </div>
            <div className="flex justify-center md:justify-start gap-8 py-2">
              <p className="text-gray-700">
                <i className="fas fa-phone text-green-600"></i> (+855) 456-7890
              </p>
              <p className="text-gray-700">
                <i className="fas fa-print text-green-600"></i> (+855) 456-7890
              </p>
            </div>
            <div className="py-2 flex justify-center md:justify-start gap-8">
              <p className="text-gray-700 mb-2">Social Media</p>
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a
                  href="#"
                  className="text-sky-500 hover:text-sky-700"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-blue-700 hover:text-blue-900"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a
                  href="#"
                  className="text-red-600 hover:text-red-800"
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <a
                  href="#"
                  className="text-yellow-500 hover:text-yellow-700"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-red-500 hover:text-red-700"
                  aria-label="Google"
                >
                  <i className="fab fa-google"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Pinterest"
                >
                  <i className="fab fa-pinterest"></i>
                </a>
                <a
                  href="#"
                  className="text-cyan-500 hover:text-cyan-700"
                  aria-label="RSS Feed"
                >
                  <i className="fas fa-rss"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright */}
      <div className="bg-green-700 text-white py-4">
        <div className="text-center">
          <p className="m-0">Copyright &copy; 2022 · RUPP, ITE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
