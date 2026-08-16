import express from "express";
import {
  handleGetAllStores,
  handlegetAllStoreProduct,
  handleGetOneStore,
} from "./store.js";

const storeRouter = express.Router();

storeRouter.get("/", handleGetAllStores);
storeRouter.get("/allproducts/:storeId", handlegetAllStoreProduct);
storeRouter.get("/:storeId", handleGetOneStore);

export default storeRouter;
