import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStores,
  fetchAllProductsByStore,
  fetchProductsBySeller,
  addProductThunk,
} from "./productThunk";

const initialState = {
  productsList: [],
  storeList: [],
  isLoading: false,
  isUploading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductsList: (state, action) => {
      state.productsList = action.payload;
    },
    setStoreList: (state, action) => {
      state.storeList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllStores
      .addCase(fetchAllStores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeList = action.payload || [];
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchAllProductsByStore
      .addCase(fetchAllProductsByStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsByStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsList = action.payload || [];
      })
      .addCase(fetchAllProductsByStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchProductsBySeller
      .addCase(fetchProductsBySeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsBySeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsList = action.payload || [];
      })
      .addCase(fetchProductsBySeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // addProductThunk
      .addCase(addProductThunk.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.isUploading = false;
        if (action.payload) {
          state.productsList.push(action.payload);
        }
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      });
  },
});

export const { setProductsList, setStoreList } = productSlice.actions;
export default productSlice.reducer;
