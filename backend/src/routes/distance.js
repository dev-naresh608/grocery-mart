import express from "express";
const distanceRouter = express.Router();

import {
  handleGetDistanceAndEta,
  handleGetAddressApi,
  handleReverseGeocodeApi,
} from "../controllers/distance.js";

distanceRouter.get("/", handleGetDistanceAndEta);
distanceRouter.get("/distance", handleGetDistanceAndEta);
distanceRouter.get("/address", handleGetAddressApi);
distanceRouter.get("/reverse", handleReverseGeocodeApi);

export default distanceRouter;
