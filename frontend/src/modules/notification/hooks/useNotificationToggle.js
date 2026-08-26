import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUnreadNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
} from "../services/notification.api.service";
import {
  setUnreadData,
  markSingleRead,
  markAllRead,
} from "../store/notificationSlice";

export const useNotificationToggle = (isOpen = false) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { unreadNotifications, unreadCount } = useSelector(
    (state) => state.notification
  );
  const userId = currentUser?._id || currentUser?.id;
  const [loading, setLoading] = useState(false);

  const fetchUnread = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetchUnreadNotificationsApi(userId, 8);
      if (res && res.success) {
        dispatch(
          setUnreadData({
            notifications: res.notifications || [],
            unreadCount: res.unreadCount || 0,
          })
        );
      }
    } catch (err) {
      console.error("Failed to fetch unread notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

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
      // Optimistic update in Redux store
      dispatch(markSingleRead(notificationId));

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
      dispatch(markAllRead());

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
