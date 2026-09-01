import express from "express";
import { handleUpdateDriverLocation } from "./driver.controllers.js";

const driverRouter = express.Router();

// Dedicated endpoint for driver live GPS location updates
driverRouter.patch("/location", handleUpdateDriverLocation);

export default driverRouter;
