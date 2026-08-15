import express from "express";
const distanceRouter = epxress.Router();

import {
  handleGetDistanceAndEta,
  handleGetAddressApi,
} from "../controllers/distance.js";

distanceRouter.get("/distance", handleGetDistanceAndEta);
distanceRouter.get("/address", handleGetAddressApi);

export default distanceRouter;
