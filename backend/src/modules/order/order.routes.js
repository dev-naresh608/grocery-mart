import express from "express";

const orderRouter = express.Router();

const {
  handleGetAllOrders,
  handleAddOrder,
  handleFindOrderById,
  handleDeleteOrderById,
  handleUpdateOrderById,
} = require("./order.controllers");

orderRouter.get("/:userId", handleGetAllOrders);
orderRouter.post("/", handleAddOrder);

orderRouter
  .route("/detail/:orderId")
  .get(handleFindOrderById)
  .delete(handleDeleteOrderById)
  .patch(handleUpdateOrderById);

export default orderRouter;
