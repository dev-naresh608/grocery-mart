import express from "express";
import {
  handleGetUserNotifications,
  handleGetUnreadNotifications,
  handleMarkAsRead,
  handleMarkAsUnread,
  handleMarkAllAsRead,
  handleDeleteNotification,
  handleClearNotifications,
  handleCreateNotification,
} from "./notification.controllers.js";

const notificationRouter = express.Router();

// User notifications
notificationRouter.get("/user/:userId", handleGetUserNotifications);
notificationRouter.get("/unread/:userId", handleGetUnreadNotifications);
notificationRouter.patch("/read/:notificationId", handleMarkAsRead);
notificationRouter.patch("/unread/:notificationId", handleMarkAsUnread);
notificationRouter.patch("/read-all/:userId", handleMarkAllAsRead);
notificationRouter.delete("/delete/:notificationId", handleDeleteNotification);
notificationRouter.delete("/clear/:userId", handleClearNotifications);
notificationRouter.post("/create", handleCreateNotification);

export default notificationRouter;
