import express from "express";

import {
  handleGetAddressApi,
  handleAddAddressApi,
  handleDeleteAddressApi,
  handleUpdateAddressApi,
} from "./address.controllers.js";

const addressRouter = express.Router();

addressRouter.get("/all/:userId", handleGetAddressApi);
addressRouter.post("/add/:userId", handleAddAddressApi);
addressRouter.delete("/delete/:addressId", handleDeleteAddressApi);
addressRouter.patch("/update/:addressId", handleUpdateAddressApi);

export default addressRouter;
