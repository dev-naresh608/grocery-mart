import { createSlice } from "@reduxjs/toolkit";
import { addToCartApi } from "@/modules/cart/services/cart.api";

import {
  register,
  login,
  getMe,
  rotateToken,
  logout,
} from "./authThunk.js";

const clearGuestLocalStorage = () => {
  try {
    localStorage.removeItem("novexa_guest_cart");
    localStorage.removeItem("novexa_cart_store_id");
  } catch (e) {}
};

const syncGuestCartToUser = (user) => {
  if (!user || (user.role && user.role !== "customer")) {
    clearGuestLocalStorage();
    return user;
  }
  try {
    const saved = localStorage.getItem("novexa_guest_cart");
    if (!saved) {
      clearGuestLocalStorage();
      return user;
    }
    const guestItems = JSON.parse(saved);
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      clearGuestLocalStorage();
      return user;
    }

    const existingCart = user.myCart || [];
    const mergedCart = [...existingCart];

    guestItems.forEach((gItem) => {
      const exists = mergedCart.some((item) => item._id === gItem._id);
      if (!exists) {
        mergedCart.push(gItem);
        if (user._id) {
          addToCartApi(user._id, gItem._id, gItem.store_id || gItem.storeId, gItem.product_qty || 1).catch((err) =>
            console.error("Failed to sync guest item to DB:", err)
          );
        }
      }
    });

    clearGuestLocalStorage();
    return { ...user, myCart: mergedCart };
  } catch (e) {
    clearGuestLocalStorage();
    return user;
  }
};

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isCheckingAuth = false;
      state.error = null;
      clearGuestLocalStorage();
    },
    updateUser: (state, action) => {
      if (state.user) {
        if (typeof action.payload === "function") {
          state.user = action.payload(state.user);
        } else {
          state.user = { ...state.user, ...action.payload };
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;

        const { user, accessToken } = action.payload;

        state.user = syncGuestCartToUser(user);
        state.accessToken = accessToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;

        const { user, accessToken } = action.payload;

        state.user = syncGuestCartToUser(user);
        state.accessToken = accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
      })

      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        clearGuestLocalStorage();
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // Rotate Token
      .addCase(rotateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rotateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        clearGuestLocalStorage();
      })
      .addCase(rotateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.error = null;
        clearGuestLocalStorage();
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isCheckingAuth = false;
        state.error = null;
        clearGuestLocalStorage();
      });
  },
});

export const { clearAuth, updateUser } = authSlice.actions;

export default authSlice.reducer;