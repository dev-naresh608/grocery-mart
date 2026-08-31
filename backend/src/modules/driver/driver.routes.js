import express from "express";
import {
  handleUpdateDriverLocation,
  handleGetDriverLocation,
} from "./driver.controllers.js";
import { authenticateAccessToken } from "../../middlewares/auth.middleware.js";

const driverRouter = express.Router();

driverRouter.patch("/location", authenticateAccessToken, handleUpdateDriverLocation);
driverRouter.get("/location", authenticateAccessToken, handleGetDriverLocation);

export default driverRouter;
