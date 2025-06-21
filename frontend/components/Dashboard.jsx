"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Grid,
  LogOut,
  MessageSquare,
  PlusSquare,
  User,
} from "lucide-react";
import { FiMapPin } from "react-icons/fi";

import { userStore } from "@/store/userStore";
import { AppNavbar } from "@/components/app-navbar";

export default function Sidebar({ children }) {
  const { id } = useParams();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, loading, error } = userStore();
  const router = useRouter();
  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const sidebarWidth = collapsed ? "w-20" : "w-64";
  const mainMargin = collapsed ? "ml-20" : "ml-64";

  const menuItems = [
    { href: `/admin/${id}/dashboard`, icon: BarChart2, label: "Dashboard" },
    { href: `/admin/${id}/category`, icon: Grid, label: "Category" },
    { href: `/admin/${id}/location`, icon: FiMapPin, label: "Location" },
    { href: `/admin/${id}/addpackage`, icon: PlusSquare, label: "Add Package" },
    { href: `/admin/${id}/user`, icon: User, label: "User" },
    {
      href: `/admin/${id}/feedback-admin`,
      icon: MessageSquare,
      label: "Feedback",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

      if (
        (isMac && e.metaKey && e.key === "s") ||
        (!isMac && e.ctrlKey && e.key === "s")
      ) {
        e.preventDefault(); // prevent default save action
        router.back(); // or any page you want to navigate to
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, id]);
  if (loading) {
    <p>loading.....</p>;
  }
  if (error) {
    <p>error..{error}</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${sidebarWidth} fixed h-screen bg-white border-r shadow-lg overflow-y-auto transition-all duration-300 z-20`}
      >
        <div className="text-center py-6 border-b relative">
          <Image
            src="/image/logo.png"
            alt="logo"
            width={collapsed ? 40 : 120}
            height={collapsed ? 40 : 120}
            className="m-auto object-cover"
          />
          <button
            onClick={toggleSidebar}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-50 hover:bg-blue-100 p-1 rounded-full text-blue-500"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="mt-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${
                      collapsed ? "justify-center px-2" : "px-6"
                    } py-3 rounded-lg ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
                    } ${collapsed ? "mx-2" : "mx-4"}`}
                    title={collapsed ? item.label : ""}
                  >
                    <item.icon
                      className={`${collapsed ? "w-6 h-6" : "w-5 h-5"}`}
                    />
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className={`flex items-center ${
                  collapsed ? "justify-center px-4" : "px-6"
                } py-3 text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg ${
                  collapsed ? "mx-2" : "mx-4"
                }`}
                title={collapsed ? "Logout" : ""}
              >
                <LogOut className={`${collapsed ? "w-6 h-6" : "w-5 h-5"}`} />
                {!collapsed && <span className="ml-3">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`${mainMargin} flex-1 transition-all duration-300`}>
        <AppNavbar
          id={id}
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          setCollapsed={setCollapsed}
        />
        {/* Main content */}
        <main className="p-6 bg-gray-50 overflow-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
