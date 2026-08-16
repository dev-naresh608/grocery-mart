import express from "express";

import {
  handleGetAllOrders,
  handleAddOrder,
  handleFindOrderById,
  handleDeleteOrderById,
  handleUpdateOrderById,
} from "./order.controllers.js";

const orderRouter = express.Router();

orderRouter.get("/:userId", handleGetAllOrders);
orderRouter.post("/", handleAddOrder);

orderRouter
  .route("/detail/:orderId")
  .get(handleFindOrderById)
  .delete(handleDeleteOrderById)
  .patch(handleUpdateOrderById);

export default orderRouter;
