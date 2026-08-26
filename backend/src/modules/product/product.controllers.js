import Product from "./product.model.js";
import Seller from "../seller/seller.model.js";
import {
  addProductSvc,
  updateProductSvc,
  deleteProductSvc,
  deleteTempFolder,
  findProductSvc,
} from "./product.service.js";

import { uploadOnCloudinary } from "../../utils/cloudinary.js";

export const handleGetAllProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let sellerStoreId = userId;
    const seller = await Seller.findOne({ $or: [{ _id: userId }, { user_id: userId }] });
    if (seller) {
      sellerStoreId = seller._id;
    }

    const allProducts = await Product.find({
      $or: [{ store_id: userId }, { store_id: sellerStoreId }],
    });

    return res.status(200).json({
      success: true,
      message: "Your products",
      result: allProducts || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAddProduct = async (req, res) => {
  try {
    const payload = req.body;
    const file = req.file;

    if (!payload) {
      return res
        .status(400)
        .json({ success: false, message: "Form data is required" });
    }

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Product image is required" });
    }

    const uploadedImg = await uploadOnCloudinary(file.path);

    if (!uploadedImg || !uploadedImg.success) {
      return res.status(400).json({
        success: false,
        message: uploadedImg?.message || "Cloudinary image upload failed",
      });
    }

    const { url, public_id } = uploadedImg;

    const result = await addProductSvc(payload, url, public_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      result: result.product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleFindProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const result = await findProductSvc(productId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteProductById = async (req, res) => {
  try {
    const { store_id } = req.body;
    const { productId } = req.params;

    const result = await deleteProductSvc(productId, store_id);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleUpdateProductById = async (req, res) => {
  try {
    const { store_id, updates } = req.body;
    const { productId } = req.params;

    if (!updates) {
      return res.status(400).json({
        success: false,
        message: "Please send update data",
      });
    }

    const result = await updateProductSvc(productId, store_id, updates);

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
