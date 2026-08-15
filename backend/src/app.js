import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

import {
  authRoute,
  // distanceRoute,
  // storeRoute,
  // addressRoute,
  // productRoute,
  // orderRoute,
  // cartRoute,
  // adminRoute,
} from "./routes.js";

// Middle Wares
app.use(cors());
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

app.use(morgan("dev"));
app.use(cookieParser());

// ROUTES:
app.get("/test", (req, res) => {
  res.json({ message: "api running" });
});

// ADMIN ROUTE
// app.use("/admin", adminRoute);

// OTHER ROUTES
app.use("/api/auth", authRoute);
// app.use("/api/distance", distanceRoute);
// app.use("/api/product", productRoute);
// app.use("/api/order", orderRoute);
// app.use("/api/cart", cartRoute);
// app.use("/api/stores", storeRoute);
// app.use("/api/address", addressRoute);

export default app;
