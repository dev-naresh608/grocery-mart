import express from "express";

const {
  handleGetAddressApi,
  handleAddAddressApi,
  handleDeleteAddressApi,
  handleUpdateAddressApi,
} = require("./address.controllers");

const addressRouter = express.Router();

addressRouter.get("/all/:userId", handleGetAddressApi);
addressRouter.post("/add/:userId", handleAddAddressApi);
addressRouter.delete("/delete/:addressId", handleDeleteAddressApi);
addressRouter.patch("/update/:addressId", handleUpdateAddressApi);

export default addressRouter;
