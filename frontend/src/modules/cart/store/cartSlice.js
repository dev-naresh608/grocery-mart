import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storeId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setStoreId: (state, action) => {
      state.storeId = action.payload;
    },
    clearCartState: (state) => {
      state.storeId = null;
    },
  },
});

export const { setStoreId, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
