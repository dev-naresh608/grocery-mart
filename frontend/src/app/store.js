import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../modules/auth/store/authSlice.js";
import cartReducer from "../modules/cart/store/cartSlice.js";
import productReducer from "../modules/seller/store/productSlice.js";
import categoryReducer from "../modules/category/store/categorySlice.js";
import orderReducer from "../modules/order/store/orderSlice.js";
import addressReducer from "../modules/address/store/addressSlice.js";
import notificationReducer from "../modules/notification/store/notificationSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
    address: addressReducer,
    notification: notificationReducer,
  },
});

export default store;
