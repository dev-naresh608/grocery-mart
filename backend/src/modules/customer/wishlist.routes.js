import express from "express";
import { toggleWishlistStore, getWishlistStores } from "./wishlist.controllers.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/toggle", toggleWishlistStore);
wishlistRouter.get("/:userId", getWishlistStores);

export default wishlistRouter;
