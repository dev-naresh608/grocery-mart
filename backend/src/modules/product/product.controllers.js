import Product from "./product.model.js";
import {
  addProductService,
  updateProductService,
  deleteProductService,
  deleteTempFolder,
  findProductSvc,
} from "./product.service.js";

import { uploadOnCloudinary } from "../../utils/cloudinary.js";

export const handleGetAllProducts = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(200).json({
      success: false,
      message: "User is required",
    });
  }
  const allProducts = await Product.find({ store_id: userId });

  if (allProducts.length === 0) {
    return res.status(400).json({
      success: false,
      message: "there is no products in your store",
      result: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Your products",
    result: allProducts,
  });
};

export const handleAddProduct = async (req, res) => {
  try {
    const payload = req.body;
    const file = req.file;

    if (!payload) {
      return res
        .status(400)
        .json({ success: false, message: "formdata is required" });
    }

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "img is required" });
    }

    const uploadedImg = await uploadOnCloudinary(file.path);
    // console.log("uploaded image data: ", uploadedImg);

    if (!uploadedImg.success) {
      return uploadedImg;
    }

    const { url, public_id } = uploadedImg;

    const product = await addProductService(payload, url, public_id);

    return res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleFindProductById = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(200).json({
      success: false,
      message: "product id is required",
    });
  }

  const result = await findProductSvc(productId);

  if (!result) {
    return res.status(200).json({
      success: false,
      message: "No product Found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "product fetched successfully",
    product: result,
  });
};

export const handleDeleteProductById = async (req, res) => {
  const { store_id } = req.body;
  const { productId } = req.params;

  const result = await deleteProductService(productId, store_id);
  return res.json({ success: true, result, message: "deleted successfully" });
};

export const handleUpdateProductById = async (req, res) => {
  const { store_id, updates } = req.body;

  const { productId } = req.params;

  if (!updates) {
    return {
      success: false,
      message: "Please send me data",
    };
  }
  const result = await updateProductService(productId, store_id, updates);

  return res.status(201).json({ message: "Updated successfully" });
};
