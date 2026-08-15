import express from "express";

const storeRouter = epxress.Router();

import {
  handleGetAllStores,
  handlegetAllStoreProduct,
  handleGetOneStore,
} from "../controllers/store.js";

storeRouter.get("/", handleGetAllStores);
storeRouter.get("/:storeId", handleGetOneStore);
storeRouter.get("/allproducts/:storeId", handlegetAllStoreProduct);

export default storeRouter;
