import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartApi,
  addToCartApi,
  updateCartQtyApi,
  removeFromCartApi,
  clearCartApi,
} from "../services/cart.api.service";

export const fetchCartThunk = createAsyncThunk(
  "cart/fetchCartThunk",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getCartApi(userId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/addToCartThunk",
  async ({ userId, productId, storeId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const data = await addToCartApi(userId, productId, storeId, quantity);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCartQtyThunk = createAsyncThunk(
  "cart/updateCartQtyThunk",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await updateCartQtyApi(userId, productId, quantity);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCartThunk",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const data = await removeFromCartApi(userId, productId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return { productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCartThunk",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await clearCartApi(userId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
