import express from "express";
import multer from "multer";

import { upload } from "../../middlewares/multer.middleware.js";

const productRouter = express.Router();
const {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
} = require("./product.controllers");

productRouter.get("/allproducts/:userId", handleGetAllProducts);
productRouter.post(
  "/add-product",
  upload.single("product_img"),
  handleAddProduct,
);

productRouter
  .route("/:productId")
  .get(handleFindProductById)
  .patch(handleUpdateProductById)
  .delete(handleDeleteProductById);

export default productRouter;
