import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProductApi,
  getAllProductsApi,
  getProductByIdApi,
  updateProductApi,
  deleteProductApi,
  getAllStoresApi,
  getStoreProductsApi,
} from "../services/product.api.service";

export const fetchAllStores = createAsyncThunk(
  "product/fetchAllStores",
  async (searchQuery = "", { rejectWithValue }) => {
    try {
      const data = await getAllStoresApi(searchQuery);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllProductsByStore = createAsyncThunk(
  "product/fetchAllProductsByStore",
  async (storeId, { rejectWithValue }) => {
    try {
      const data = await getStoreProductsApi(storeId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProductsBySeller = createAsyncThunk(
  "product/fetchProductsBySeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const data = await getAllProductsApi(sellerId);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProductThunk = createAsyncThunk(
  "product/addProductThunk",
  async (formDataToSend, { rejectWithValue }) => {
    try {
      const data = await addProductApi(formDataToSend);
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
