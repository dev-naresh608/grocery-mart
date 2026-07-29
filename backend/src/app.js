const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const {
  distanceRoute,
  storeRoute,
  addressRoute,
  authRoute,
  productRoute,
  orderRoute,
  cartRoute,
  adminRoute,
} = require("./routes");

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
app.use("/admin", adminRoute);

// OTHER ROUTES
app.use("/api/auth", authRoute);
app.use("/api", distanceRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);
app.use("/cart", cartRoute);
app.use("/stores", storeRoute);
app.use("/address", addressRoute);

module.exports = app;