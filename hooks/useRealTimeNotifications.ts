import { useNotifications } from "@/context/NotificationContext";
import { useEffect } from "react";

export function useRealTimeNotifications() {
  const { fetchNotifications } = useNotifications();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "notification_update") {
        fetchNotifications();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications]);
}
