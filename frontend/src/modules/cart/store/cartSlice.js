import { createSlice } from "@reduxjs/toolkit";

const getInitialGuestCart = () => {
  try {
    const saved = localStorage.getItem("novexa_guest_cart");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const getInitialStoreId = () => {
  try {
    return localStorage.getItem("novexa_cart_store_id") || null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  storeId: getInitialStoreId(),
  guestCart: getInitialGuestCart(),
  isCartDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setStoreId: (state, action) => {
      state.storeId = action.payload;
      if (action.payload) {
        localStorage.setItem("novexa_cart_store_id", action.payload);
      } else {
        localStorage.removeItem("novexa_cart_store_id");
      }
    },
    setGuestCart: (state, action) => {
      state.guestCart = action.payload;
      try {
        localStorage.setItem("novexa_guest_cart", JSON.stringify(action.payload));
      } catch (e) {
        console.error("Failed to save guest cart to localStorage", e);
      }
    },
    clearGuestCart: (state) => {
      state.guestCart = [];
      try {
        localStorage.removeItem("novexa_guest_cart");
      } catch (e) {}
    },
    clearCartState: (state) => {
      state.storeId = null;
      state.guestCart = [];
      try {
        localStorage.removeItem("novexa_cart_store_id");
        localStorage.removeItem("novexa_guest_cart");
      } catch (e) {}
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
  setGuestCart,
  clearGuestCart,
  clearCartState,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
} = cartSlice.actions;
export default cartSlice.reducer;
