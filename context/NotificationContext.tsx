"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type?: "ACCEPTED_APPOINTMENT" | "REJECTED_APPOINTMENT" | "INFO" | "APPOINTMENT";
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {},
  markAllAsRead: async () => {},
  addNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      const data = await res.json();
      if (data.success) {
        const fetched = data.notifications || [];
        setNotifications(fetched);
        setUnreadCount(fetched.filter((n: Notification) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
    toast.success(notification.title || "New notification");
  };

  const markAllAsRead = async () => {
    if (!user) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await fetch("/api/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      //  تحديث فوري بعد التحديد كمقروء
      fetchNotifications();

      toast.success("All notifications marked as read ");
    } catch {
      toast.error("Failed to mark all as read");
      fetchNotifications();
    }
  };

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(fetchNotifications, 10000);
    const handleVisibilityChange = () => {
      if (!document.hidden && user) fetchNotifications();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
