import express from "express";

import {
  handleGetCartByUser,
  handleAddToCart,
  handleUpdateCartQty,
  handleRemoveFromCart,
  handleClearCart,
  handleFindCartItemById,
} from "./cart.controllers.js";

const cartRouter = express.Router();

cartRouter.get("/user/:userId", handleGetCartByUser);
cartRouter.post("/add", handleAddToCart);
cartRouter.patch("/update", handleUpdateCartQty);
cartRouter.delete("/remove/:userId/:productId", handleRemoveFromCart);
cartRouter.delete("/clear/:userId", handleClearCart);
cartRouter.get("/:productId", handleFindCartItemById);

export default cartRouter;
