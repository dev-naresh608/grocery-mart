import express from "express";

const cartRouter = express.Router();

const {
  handleGetCartByUser,
  handleAddToCart,
  handleUpdateCartQty,
  handleRemoveFromCart,
  handleClearCart,
  handleFindCartItemById,
} = require("./cart.controllers");

cartRouter.get("/user/:userId", handleGetCartByUser);
cartRouter.post("/add", handleAddToCart);
cartRouter.patch("/update", handleUpdateCartQty);
cartRouter.delete("/remove/:userId/:productId", handleRemoveFromCart);
cartRouter.delete("/clear/:userId", handleClearCart);
cartRouter.get("/:productId", handleFindCartItemById);

export default cartRouter;
