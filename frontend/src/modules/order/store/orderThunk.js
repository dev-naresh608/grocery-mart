import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllOrdersApi,
  getOrderDetailApi,
  createOrderApi,
  updateOrderStatusApi,
} from "../services/order.api.service";

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const data = await getAllOrdersApi(userId, role);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.allOrders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrderDetailThunk = createAsyncThunk(
  "order/fetchOrderDetailThunk",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await getOrderDetailApi(orderId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  "order/createOrderThunk",
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await createOrderApi(orderData);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
