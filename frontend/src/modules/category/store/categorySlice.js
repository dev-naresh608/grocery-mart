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
  { catName: "Others", catIcon: "🧺" },
];

const initialState = {
  categories: DEFAULT_CATEGORIES,
  showAllCategoryEnable: false,
  showCategoriesAsScreen: DEFAULT_CATEGORIES,
  screenWidth: 0,
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
      const width = action.payload;
      state.screenWidth = width;

      if (state.showAllCategoryEnable) {
        state.showCategoriesAsScreen = state.categories;
        state.showCatBtnText = "Show Less";
      } else {
        state.showCatBtnText = "Show All";
        state.showCategoriesAsScreen = state.categories.slice(0, width);
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
