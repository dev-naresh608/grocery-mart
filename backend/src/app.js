import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./modules/auth/auth.routes.js";
import productRouter from "./modules/product/product.routes.js";
import orderHistoryRouter from "./modules/order/order-history/orderHistory.routes.js";
import activeOrdersRouter from "./modules/order/active-orders/activeOrders.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import addressRouter from "./modules/address/address.routes.js";
import storeRouter from "./modules/store/store.routes.js";
import distanceRouter from "./routes/distance.js";
import notificationRouter from "./modules/notification/notification.routes.js";
import wishlistRouter from "./modules/customer/wishlist.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "100mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  }),
);

app.use(cookieParser());

// Health check endpoint
app.get("/api/working", (req, res) => {
  res.json({ message: "api running" });
});

// Mounted Routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderHistoryRouter);
app.use("/api/active-orders", activeOrdersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/stores", storeRouter);
app.use("/api/distance", distanceRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/wishlist", wishlistRouter);

export default app;
