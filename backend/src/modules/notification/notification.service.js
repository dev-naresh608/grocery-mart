import Notification from "./notification.model.js";

/**
 * Create a new notification
 */
export const createNotificationSvc = async ({
  recipient,
  sender = null,
  title,
  message,
  type = "general",
  link = null,
  metadata = {},
}) => {
  try {
    if (!recipient || !title || !message) {
      return {
        success: false,
        message: "Recipient, title, and message are required",
      };
    }

    const notification = await Notification.create({
      recipient,
      sender,
      title,
      message,
      type,
      link,
      metadata,
    });

    return {
      success: true,
      notification,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Get paginated notifications with filters
 */
export const getUserNotificationsSvc = async (
  userId,
  { page = 1, limit = 10, filter = "all", type, search } = {}
) => {
  try {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const query = { recipient: userId };

    if (filter === "unread") {
      query.isRead = false;
    } else if (filter === "read") {
      query.isRead = true;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ title: searchRegex }, { message: searchRegex }];
    }

    const [notifications, total, unreadCount, totalAll] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: userId, isRead: false }),
      Notification.countDocuments({ recipient: userId }),
    ]);

    const readCount = totalAll - unreadCount;
    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      success: true,
      notifications,
      total,
      unreadCount,
      readCount,
      totalAll,
      page: pageNum,
      limit: limitNum,
      totalPages,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        nextPage: pageNum < totalPages ? pageNum + 1 : null,
        prevPage: pageNum > 1 ? pageNum - 1 : null,
        skip,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      notifications: [],
      total: 0,
      unreadCount: 0,
      readCount: 0,
      totalAll: 0,
      page: 1,
      totalPages: 1,
    };
  }
};

/**
 * Get unread notifications for header toggle/dropdown
 */
export const getUnreadNotificationsSvc = async (userId, limit = 10) => {
  try {
    const [unreadNotifications, unreadCount, totalCount] = await Promise.all([
      Notification.find({ recipient: userId, isRead: false })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ recipient: userId, isRead: false }),
      Notification.countDocuments({ recipient: userId }),
    ]);

    return {
      success: true,
      notifications: unreadNotifications,
      unreadCount,
      totalCount,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      notifications: [],
      unreadCount: 0,
      totalCount: 0,
    };
  }
};

/**
 * Mark a single notification as read
 */
export const markAsReadSvc = async (notificationId, userId) => {
  try {
    const query = { _id: notificationId };
    if (userId) {
      query.recipient = userId;
    }

    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return { success: false, message: "Notification not found" };
    }

    return { success: true, notification };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Mark a single notification as unread
 */
export const markAsUnreadSvc = async (notificationId, userId) => {
  try {
    const query = { _id: notificationId };
    if (userId) {
      query.recipient = userId;
    }

    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: false, readAt: null },
      { new: true }
    );

    if (!notification) {
      return { success: false, message: "Notification not found" };
    }

    return { success: true, notification };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsReadSvc = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return {
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Delete a single notification
 */
export const deleteNotificationSvc = async (notificationId, userId) => {
  try {
    const query = { _id: notificationId };
    if (userId) {
      query.recipient = userId;
    }

    const deleted = await Notification.findOneAndDelete(query);
    if (!deleted) {
      return { success: false, message: "Notification not found" };
    }

    return {
      success: true,
      message: "Notification deleted successfully",
      notificationId,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Clear notifications for a user (either all or only read)
 */
export const clearNotificationsSvc = async (userId, filter = "read") => {
  try {
    const query = { recipient: userId };
    if (filter === "read") {
      query.isRead = true;
    }

    const result = await Notification.deleteMany(query);

    return {
      success: true,
      message: `Cleared ${result.deletedCount} notifications`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
