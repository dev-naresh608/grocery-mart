import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  fetchUserNotificationsApi,
  markNotificationAsReadApi,
  markNotificationAsUnreadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
  clearNotificationsApi,
} from "../services/notification.api.service";

export const useAllNotifications = (initialLimit = 10) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?._id || currentUser?.id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'read'
  const [categoryType, setCategoryType] = useState("all"); // 'all' | 'order' | 'system' | 'delivery' | 'promotion'
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [totalAll, setTotalAll] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchUserNotificationsApi(userId, {
        page,
        limit,
        filter: filter !== "all" ? filter : undefined,
        type: categoryType !== "all" ? categoryType : undefined,
        search: searchTerm,
      });

      if (res && res.success) {
        setNotifications(res.notifications || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setUnreadCount(res.unreadCount || 0);
        setReadCount(res.readCount || 0);
        setTotalAll(res.totalAll || 0);
      }
    } catch (err) {
      console.error("Error fetching all notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit, filter, categoryType, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle filter change (reset to page 1)
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Handle category type change (reset to page 1)
  const handleCategoryChange = (newType) => {
    setCategoryType(newType);
    setPage(1);
  };

  // Handle search (reset to page 1)
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  // Mark single as read
  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId || !userId) return;
    try {
      setNotifications((prev) =>
        prev.map((n) =>
          (n._id || n.id) === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setReadCount((prev) => prev + 1);

      await markNotificationAsReadApi(notificationId, userId);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      fetchNotifications();
    }
  };

  // Mark single as unread
  const handleMarkAsUnread = async (notificationId) => {
    if (!notificationId || !userId) return;
    try {
      setNotifications((prev) =>
        prev.map((n) =>
          (n._id || n.id) === notificationId
            ? { ...n, isRead: false, readAt: null }
            : n
        )
      );
      setUnreadCount((prev) => prev + 1);
      setReadCount((prev) => Math.max(0, prev - 1));

      await markNotificationAsUnreadApi(notificationId, userId);
    } catch (err) {
      console.error("Failed to mark as unread:", err);
      fetchNotifications();
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setReadCount((prev) => prev + unreadCount);
      setUnreadCount(0);

      await markAllNotificationsAsReadApi(userId);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchNotifications();
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId) => {
    if (!notificationId || !userId) return;
    try {
      const target = notifications.find((n) => (n._id || n.id) === notificationId);
      setNotifications((prev) =>
        prev.filter((n) => (n._id || n.id) !== notificationId)
      );
      setTotal((prev) => Math.max(0, prev - 1));
      setTotalAll((prev) => Math.max(0, prev - 1));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        setReadCount((prev) => Math.max(0, prev - 1));
      }

      await deleteNotificationApi(notificationId, userId);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      fetchNotifications();
    }
  };

  // Clear read notifications
  const handleClearRead = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      await clearNotificationsApi(userId, "read");
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
      setLoading(false);
    }
  };

  return {
    currentUser,
    notifications,
    loading,
    filter,
    categoryType,
    searchTerm,
    page,
    limit,
    totalPages,
    total,
    unreadCount,
    readCount,
    totalAll,
    setPage,
    handleFilterChange,
    handleCategoryChange,
    handleSearchChange,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleClearRead,
    refresh: fetchNotifications,
  };
};
