import api from "@/configs/api";

/**
 * Fetch paginated notifications for a user with optional filters
 * @param {string} userId
 * @param {object} params { page, limit, filter, type, search }
 */
export const fetchUserNotificationsApi = async (userId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.filter) query.append("filter", params.filter);
  if (params.type && params.type !== "all") query.append("type", params.type);
  if (params.search) query.append("search", params.search);

  const url = `/notification/user/${userId}${query.toString() ? `?${query.toString()}` : ""}`;
  const { data } = await api.get(url);
  return data;
};

/**
 * Fetch quick unread notifications for header toggle/dropdown
 * @param {string} userId
 * @param {number} limit
 */
export const fetchUnreadNotificationsApi = async (userId, limit = 10) => {
  const { data } = await api.get(`/notification/unread/${userId}?limit=${limit}`);
  return data;
};

/**
 * Mark a single notification as read
 * @param {string} notificationId
 * @param {string} userId
 */
export const markNotificationAsReadApi = async (notificationId, userId) => {
  const { data } = await api.patch(`/notification/read/${notificationId}`, {
    userId,
  });
  return data;
};

/**
 * Mark a single notification as unread
 * @param {string} notificationId
 * @param {string} userId
 */
export const markNotificationAsUnreadApi = async (notificationId, userId) => {
  const { data } = await api.patch(`/notification/unread/${notificationId}`, {
    userId,
  });
  return data;
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId
 */
export const markAllNotificationsAsReadApi = async (userId) => {
  const { data } = await api.patch(`/notification/read-all/${userId}`);
  return data;
};

/**
 * Delete a single notification
 * @param {string} notificationId
 * @param {string} userId
 */
export const deleteNotificationApi = async (notificationId, userId) => {
  const { data } = await api.delete(
    `/notification/delete/${notificationId}?userId=${userId}`
  );
  return data;
};

/**
 * Clear notifications for a user
 * @param {string} userId
 * @param {string} filter 'read' | 'all'
 */
export const clearNotificationsApi = async (userId, filter = "read") => {
  const { data } = await api.delete(
    `/notification/clear/${userId}?filter=${filter}`
  );
  return data;
};

/**
 * Create a new notification (client-side trigger or mock)
 * @param {object} payload
 */
export const createNotificationApi = async (payload) => {
  const { data } = await api.post("/notification/create", payload);
  return data;
};
