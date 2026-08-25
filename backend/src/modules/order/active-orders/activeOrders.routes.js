import express from "express";
import {
  handleGetActiveOrders,
  handleUpdateOrderStatus,
  handleGetAvailableDriverRequests,
  handleDriverAcceptOrder,
  handleDriverRejectOrder,
  handleRetryDriverAllocation,
} from "./activeOrders.controllers.js";

const activeOrdersRouter = express.Router();

activeOrdersRouter.get("/driver-requests/:driverId", handleGetAvailableDriverRequests);
activeOrdersRouter.post("/:orderId/driver-accept", handleDriverAcceptOrder);
activeOrdersRouter.post("/:orderId/driver-reject", handleDriverRejectOrder);
activeOrdersRouter.post("/:orderId/retry-driver", handleRetryDriverAllocation);

activeOrdersRouter.get("/:userId", handleGetActiveOrders);
activeOrdersRouter.patch("/:orderId/status", handleUpdateOrderStatus);

export default activeOrdersRouter;
