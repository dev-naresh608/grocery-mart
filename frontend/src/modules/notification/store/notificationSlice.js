import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadNotifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadData: (state, action) => {
      state.unreadNotifications = action.payload.notifications || [];
      state.unreadCount = action.payload.unreadCount ?? action.payload.notifications?.length ?? 0;
    },
    markSingleRead: (state, action) => {
      const notifId = action.payload;
      state.unreadNotifications = state.unreadNotifications.filter(
        (n) => (n._id || n.id) !== notifId
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAllRead: (state) => {
      state.unreadNotifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadData, markSingleRead, markAllRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
