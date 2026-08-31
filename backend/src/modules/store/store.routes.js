import express from "express";
import {
  handleGetAllStores,
  handlegetAllStoreProduct,
  handleGetOneStore,
  handleUpdateStoreLocation,
} from "./store.controller.js";
import { authenticateAccessToken } from "../../middlewares/auth.middleware.js";

const storeRouter = express.Router();

storeRouter.get("/", handleGetAllStores);
storeRouter.get("/allproducts/:storeId", handlegetAllStoreProduct);
storeRouter.get("/:storeId", handleGetOneStore);
storeRouter.patch("/:storeId/location", authenticateAccessToken, handleUpdateStoreLocation);

export default storeRouter;

