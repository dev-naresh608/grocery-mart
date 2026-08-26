import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storeId: null,
  isCartDrawerOpen: false,
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
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
  },
});

export const {
  setStoreId,
  clearCartState,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
} = cartSlice.actions;
export default cartSlice.reducer;
