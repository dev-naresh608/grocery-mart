import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_CATEGORIES = [
  { catName: "Fruits & Vegetables", catIcon: "🥕" },
  { catName: "Dairy & Bakery", catIcon: "🍞" },
  { catName: "Snacks & Beverages", catIcon: "🥤" },
  { catName: "Rice, Atta & Pulses", catIcon: "🌾" },
  { catName: "Spices & Oils", catIcon: "🌶️" },
  { catName: "Packaged Foods", catIcon: "📦" },
  { catName: "Cleaning & Household", catIcon: "🧹" },
  { catName: "Personal Care", catIcon: "🧴" },
];

export const getCategoryLimitForWidth = (width = 1024) => {
  if (width < 640) return 4; // Mobile screens: 4 categories (2x2 grid)
  if (width < 1024) return 6; // Tablet/Medium screens: 6 categories (3x2 grid)
  return 8; // Large/Desktop screens: 8 categories (all)
};

const initialState = {
  categories: DEFAULT_CATEGORIES,
  showAllCategoryEnable: false,
  showCategoriesAsScreen: DEFAULT_CATEGORIES.slice(0, 8),
  screenWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
  showCatBtnText: "Show All",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setShowAllCategoryEnable: (state, action) => {
      state.showAllCategoryEnable = action.payload;
    },
    toggleShowAllCategoryEnable: (state) => {
      state.showAllCategoryEnable = !state.showAllCategoryEnable;
      const limit = getCategoryLimitForWidth(state.screenWidth);
      if (state.showAllCategoryEnable) {
        state.showCategoriesAsScreen = state.categories;
        state.showCatBtnText = "Show Less";
      } else {
        state.showCategoriesAsScreen = state.categories.slice(0, limit);
        state.showCatBtnText = "Show All";
      }
    },
    setShowCategoriesAsScreen: (state, action) => {
      state.showCategoriesAsScreen = action.payload;
    },
    setScreenWidth: (state, action) => {
      state.screenWidth = action.payload;
    },
    setShowCatBtnText: (state, action) => {
      state.showCatBtnText = action.payload;
    },
    updateCategoriesForScreen: (state, action) => {
      const windowWidth = action.payload;
      state.screenWidth = windowWidth;
      const defaultLimit = getCategoryLimitForWidth(windowWidth);

      if (state.showAllCategoryEnable) {
        state.showCategoriesAsScreen = state.categories;
        state.showCatBtnText = "Show Less";
      } else {
        state.showCatBtnText = "Show All";
        state.showCategoriesAsScreen = state.categories.slice(0, defaultLimit);
      }
    },
  },
});

export const {
  setShowAllCategoryEnable,
  toggleShowAllCategoryEnable,
  setShowCategoriesAsScreen,
  setScreenWidth,
  setShowCatBtnText,
  updateCategoriesForScreen,
} = categorySlice.actions;

export default categorySlice.reducer;
