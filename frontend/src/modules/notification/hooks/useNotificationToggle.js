import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  fetchUnreadNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
} from "../services/notification.api.service";

export const useNotificationToggle = (isOpen = false) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?._id || currentUser?.id;

  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnread = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetchUnreadNotificationsApi(userId, 8);
      if (res && res.success) {
        setUnreadNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch unread notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch when component mounts, userId changes, or dropdown opens
  useEffect(() => {
    if (userId) {
      fetchUnread();
    }
  }, [userId, fetchUnread]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUnread();
    }
  }, [isOpen, userId, fetchUnread]);

  // Periodic poll every 30 seconds for new notifications
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      fetchUnread();
    }, 30000);
    return () => clearInterval(interval);
  }, [userId, fetchUnread]);

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId || !userId) return;
    try {
      // Optimistic update
      setUnreadNotifications((prev) =>
        prev.filter((n) => (n._id || n.id) !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await markNotificationAsReadApi(notificationId, userId);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Rollback by refetching
      fetchUnread();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      setUnreadNotifications([]);
      setUnreadCount(0);

      await markAllNotificationsAsReadApi(userId);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchUnread();
    }
  };

  return {
    unreadNotifications,
    unreadCount,
    loading,
    refresh: fetchUnread,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
};
