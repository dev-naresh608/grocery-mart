import express from "express";
import {
  handleGetAllOrders,
  handleAddOrder,
  handleFindOrderById,
  handleDeleteOrderById,
} from "./orderHistory.controllers.js";

const orderHistoryRouter = express.Router();

orderHistoryRouter.get("/:userId", handleGetAllOrders);
orderHistoryRouter.post("/", handleAddOrder);

orderHistoryRouter
  .route("/detail/:orderId")
  .get(handleFindOrderById)
  .delete(handleDeleteOrderById);

export default orderHistoryRouter;
