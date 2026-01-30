"use client";
import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-bell")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block notification-bell">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-blue-700 hover:text-blue-900 transition focus:outline-none"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold 
                       rounded-full w-5 h-5 flex items-center justify-center shadow-md z-50"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b">
            <h4 className="font-semibold text-gray-700">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  await markAllAsRead();
                  setOpen(false);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 p-4">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 border-b last:border-none ${
                    !n.isRead ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <h5 className="font-medium text-gray-800">{n.title}</h5>
                  <p className="text-gray-600 text-sm">{n.message}</p>
                  <span className="text-gray-400 text-xs">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
