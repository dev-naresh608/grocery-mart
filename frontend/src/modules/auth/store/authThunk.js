import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  getMe as getMeApi,
  rotateToken as rotateTokenApi,
  logout as logoutApi,
} from "../services/auth.service.api.js";

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await registerUser(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Registration failed",
        },
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginUser(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Login failed",
        },
      );
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      return await getMeApi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user",
      );
    }
  },
);

export const rotateToken = createAsyncThunk(
  "auth/rotateToken",
  async (_, { rejectWithValue }) => {
    try {
      return await rotateTokenApi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed",
      );
    }
  },
);