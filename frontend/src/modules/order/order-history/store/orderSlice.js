import { createSlice } from "@reduxjs/toolkit";
import { fetchAllOrders } from "./orderThunk";

const initialState = {
  orders: [],
  allOrderHistory: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setAllOrderHistory: (state, action) => {
      state.allOrderHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setOrders, setAllOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;
