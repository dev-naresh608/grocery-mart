import express from "express";
import {
  handleGetAllStores,
  handlegetAllStoreProduct,
  handleGetOneStore,
  handleToggleStoreStatus,
} from "./store.controller.js";

const storeRouter = express.Router();

storeRouter.get("/", handleGetAllStores);
storeRouter.get("/allproducts/:storeId", handlegetAllStoreProduct);
storeRouter.get("/:storeId", handleGetOneStore);
storeRouter.patch("/status/:storeId", handleToggleStoreStatus);

export default storeRouter;
