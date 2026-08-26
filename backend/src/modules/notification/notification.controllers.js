import {
  createNotificationSvc,
  getUserNotificationsSvc,
  getUnreadNotificationsSvc,
  markAsReadSvc,
  markAsUnreadSvc,
  markAllAsReadSvc,
  deleteNotificationSvc,
  clearNotificationsSvc,
} from "./notification.service.js";

export const handleGetUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit, filter, type, search } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await getUserNotificationsSvc(userId, {
      page,
      limit,
      filter,
      type,
      search,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
};

export const handleGetUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await getUnreadNotificationsSvc(
      userId,
      limit ? parseInt(limit, 10) : 10
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch unread notifications",
    });
  }
};

export const handleMarkAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const result = await markAsReadSvc(notificationId, userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark notification as read",
    });
  }
};

export const handleMarkAsUnread = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const result = await markAsUnreadSvc(notificationId, userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark notification as unread",
    });
  }
};

export const handleMarkAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await markAllAsReadSvc(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark all as read",
    });
  }
};

export const handleDeleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.query;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const result = await deleteNotificationSvc(notificationId, userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete notification",
    });
  }
};

export const handleClearNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter = "read" } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await clearNotificationsSvc(userId, filter);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear notifications",
    });
  }
};

export const handleCreateNotification = async (req, res) => {
  try {
    const { recipient, sender, title, message, type, link, metadata } = req.body;

    if (!recipient || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, title, and message are required",
      });
    }

    const result = await createNotificationSvc({
      recipient,
      sender,
      title,
      message,
      type,
      link,
      metadata,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create notification",
    });
  }
};
