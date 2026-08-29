import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUnreadNotificationsApi } from "../services/notification.api.service";

export const fetchUnreadCountThunk = createAsyncThunk(
  "notification/fetchUnreadCount",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await fetchUnreadNotificationsApi(userId, 8);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
      if (action.payload && action.payload.success) {
        state.unreadNotifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount ?? action.payload.notifications?.length ?? 0;
      }
    });
  },
});

export const { setUnreadData, markSingleRead, markAllRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;

