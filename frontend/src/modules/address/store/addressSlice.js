import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAddressListThunk,
  addAddressThunk,
  deleteAddressThunk,
  updateAddressThunk,
} from "./addressThunk";

const initialState = {
  address: {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  },
  addressList: [],
  isLoading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = { ...state.address, ...action.payload };
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    resetAddressForm: (state) => {
      state.address = initialState.address;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressListThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddressListThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload || [];
        if (action.payload && action.payload.length > 0) {
          state.address = action.payload[0];
        }
      })
      .addCase(fetchAddressListThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addAddressThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.addressList.push(action.payload);
          state.address = action.payload;
        }
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.addressList = state.addressList.filter(
          (addr) => addr._id !== action.payload,
        );
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.addressList = state.addressList.map((addr) =>
            addr._id === action.payload._id ? action.payload : addr,
          );
          state.address = action.payload;
        }
      });
  },
});

export const { setAddress, setAddressList, resetAddressForm } =
  addressSlice.actions;
export default addressSlice.reducer;
