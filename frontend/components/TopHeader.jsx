import React from 'react';
import { Menu, Bell, Search } from 'lucide-react'; // Install lucide-react if not yet

export default function Topbar() {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm">
      {/* Left side: Menu + Search */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu */}
        <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none w-80"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Right side: Notification + Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-blue-500" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            6
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-right">
            <p className="text-sm font-semibold">Moni Roy</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
