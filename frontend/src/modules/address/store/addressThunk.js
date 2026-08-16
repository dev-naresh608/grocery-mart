import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  handleGetAddressApi,
  handleAddAddressApi,
  handleDeleteAddressApi,
  handleUpdateAddressApi,
} from "../services/address.api.service";

export const fetchAddressListThunk = createAsyncThunk(
  "address/fetchAddressListThunk",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await handleGetAddressApi(userId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.addressList || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addAddressThunk = createAsyncThunk(
  "address/addAddressThunk",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const data = await handleAddAddressApi(userId, payload);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAddressThunk = createAsyncThunk(
  "address/deleteAddressThunk",
  async (addressId, { rejectWithValue }) => {
    try {
      const data = await handleDeleteAddressApi(addressId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAddressThunk = createAsyncThunk(
  "address/updateAddressThunk",
  async ({ addressId, payload }, { rejectWithValue }) => {
    try {
      const data = await handleUpdateAddressApi(addressId, payload);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
