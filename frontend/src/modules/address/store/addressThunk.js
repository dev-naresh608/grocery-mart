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

export const detectUserLocationThunk = createAsyncThunk(
  "address/detectUserLocation",
  async (_, { rejectWithValue }) => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      return rejectWithValue({
        code: "UNSUPPORTED",
        message:
          "Geolocation is not supported by your browser. Please enter your address manually.",
      });
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let message =
            "Unable to retrieve your location. Please enter your address manually.";
          let code = "UNKNOWN";

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              code = "PERMISSION_DENIED";
              message =
                "Location permission was denied. Enter your address manually to continue.";
              break;
            case 2: // POSITION_UNAVAILABLE
              code = "POSITION_UNAVAILABLE";
              message =
                "Location information is unavailable. You can enter your address manually.";
              break;
            case 3: // TIMEOUT
              code = "TIMEOUT";
              message =
                "Location request timed out. You can enter your address manually.";
              break;
            default:
              break;
          }

          resolve(
            rejectWithValue({
              code,
              message,
            })
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }
);

