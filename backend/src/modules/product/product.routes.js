import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";

import {
  handleGetAllProducts,
  handleAddProduct,
  handleFindProductById,
  handleDeleteProductById,
  handleUpdateProductById,
} from "./product.controllers.js";

const productRouter = express.Router();

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
