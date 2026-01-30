"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaBell } from "react-icons/fa";
import { TbDental } from "react-icons/tb";
import { useUser } from "@/context/UserContext";
import NotificationsPage from "../pages/notifications/page";

export default function Header() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          const unread = data.notifications.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchUnreadCount();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
  };

  if (!mounted) return null;

  let dashboardLink = "/";
  if (user?.role === "ADMIN") dashboardLink = "/dashboard/admin";
  else if (user?.role === "DOCTOR") dashboardLink = "/pages/dashboard/doctors";

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90"
      } backdrop-blur-sm`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <TbDental className="text-5xl text-blue-700" />
          <span className="text-xl font-bold text-blue-700 ml-2">Al-Hayah Clinic</span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6 text-gray-800">
          {[{ name: "Home", href: "/" },
            { name: "Ask AI", href: "/pages/ai" },
            { name: "Blog", href: "/pages/blog" },
            { name: "Booking", href: "/booking" }].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-1 py-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-0.5 after:bg-blue-700 after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/login"
                className="px-3 py-1 border border-blue-700 rounded hover:bg-blue-700 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="relative flex items-center gap-5">
              {/* Notification Bell */}
              {(user.role === "PATIENT" || user.role === "DOCTOR") && (
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="relative text-2xl text-blue-700 hover:text-blue-900 transition"
                >
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Profile Button - فقط أيقونة واسم */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <FaUserCircle className="text-3xl text-blue-700" />
                <span className="font-medium text-gray-800">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white border rounded-lg shadow-lg p-2">
                  {user.role === "DOCTOR" && (
                    <Link
                      href={dashboardLink}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaUserCircle className="text-blue-600" /> Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-gray-100 rounded w-full text-left"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl text-blue-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-4 text-gray-800">
          {[{ name: "Home", href: "/" },
            { name: "Ask AI", href: "/pages/ai" },
            { name: "Blog", href: "/pages/blog" },
            { name: "Booking", href: "/booking" }].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="relative px-1 py-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-0.5 after:bg-blue-700 after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1 border border-blue-700 rounded hover:bg-blue-700 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              {(user.role === "PATIENT" || user.role === "DOCTOR") && (
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="text-black flex items-center gap-2"
                >
                  Notifications <FaBell />
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              {user.role === "DOCTOR" && (
                <Link
                  href={dashboardLink}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1 border border-blue-700 rounded hover:bg-blue-700 hover:text-white transition"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Notifications Modal */}
      {notificationsOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center mt-60">
          <div className="relative bg-white w-11/12 sm:w-[450px] max-h-[40vh] overflow-y-auto rounded-2xl shadow-2xl p-5">
            <button
              onClick={() => setNotificationsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              <FaTimes />
            </button>

            <NotificationsPage />
          </div>
        </div>
      )}
    </header>
  );
}
