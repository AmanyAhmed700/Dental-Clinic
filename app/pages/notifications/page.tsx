"use client";

import { useNotifications } from "@/context/NotificationContext";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Notifications</h1>

      {unreadCount > 0 && (
        <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
          <span className="text-blue-700 font-medium">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </span>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Mark all as read
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <FaInfoCircle className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border rounded-lg shadow-sm ${
                !n.isRead ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {n.message.includes("confirmed") && (
                  <FaCheckCircle className="text-green-600 text-lg" />
                )}
                {n.message.includes("rejected") && (
                  <FaTimesCircle className="text-red-600 text-lg" />
                )}
                {!n.type && <FaInfoCircle className="text-blue-600 text-lg" />}
                <h2 className="font-semibold text-gray-800">{n.title}</h2>
                {!n.isRead && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-2">{n.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
