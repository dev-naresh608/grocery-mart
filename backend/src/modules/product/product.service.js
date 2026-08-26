import fs from "fs";
import path from "path";

import Seller from "../seller/seller.model.js";
import Product from "./product.model.js";
import User from "../user/user.model.js";

export const addProductSvc = async (payload, url, product_id) => {
  const {
    store_id,
    product_name,
    product_weight,
    product_weight_type,
    product_cost_price,
    product_selling_price,
    product_offer_price,
    product_description,
  } = payload;

  if (!store_id) {
    return { success: false, message: "Store ID is required" };
  }

  // Resolve seller store ID (store_id could be User._id or Seller._id)
  let actualStoreId = store_id;
  const seller = await Seller.findOne({
    $or: [{ _id: store_id }, { user_id: store_id }],
  });
  if (seller) {
    actualStoreId = seller._id;
  }

  const product = await Product.create({
    store_id: actualStoreId,
    product_name: product_name,
    product_url: url,
    product_public_id: product_id || "default",
    product_weight: Number(product_weight) || 0,
    product_weight_type: product_weight_type || "none",
    product_cost_price: Number(product_cost_price) || 0,
    product_selling_price: Number(product_selling_price) || 0,
    product_offer_price: Number(product_offer_price) || 0,
    product_description: product_description || "",
  });

  return {
    success: true,
    message: "Product added successfully",
    product,
  };
};

export const updateProductSvc = async (product_id, store_id, updates) => {
  const allowedFields = [
    "product_name",
    "product_weight",
    "product_weight_type",
    "product_cost_price",
    "product_selling_price",
    "product_offer_price",
    "product_description",
    "is_product_in_stock",
    "is_offer_available",
  ];

  const filteredUpdates = {};

  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  }

  // Resolve seller store ID
  let actualStoreId = store_id;
  const seller = await Seller.findOne({
    $or: [{ _id: store_id }, { user_id: store_id }],
  });
  if (seller) {
    actualStoreId = seller._id;
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: product_id,
      $or: [{ store_id: store_id }, { store_id: actualStoreId }],
    },
    {
      $set: filteredUpdates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return product;
};

export const deleteProductSvc = async (product_id, store_id) => {
  let actualStoreId = store_id;
  const seller = await Seller.findOne({
    $or: [{ _id: store_id }, { user_id: store_id }],
  });
  if (seller) {
    actualStoreId = seller._id;
  }

  const result = await Product.findOneAndDelete({
    _id: product_id,
    $or: [{ store_id: store_id }, { store_id: actualStoreId }],
  });

  if (!result) {
    return {
      success: false,
      message: "Product not found or failed to delete",
    };
  }
  return { success: true, _id: result._id };
};

export const deleteTempFolder = async () => {
  const folderPath = path.join(process.cwd(), "temporaryUploads");
  try {
    await fs.promises.rm(folderPath, { recursive: true, force: true });
    console.log("Temp folder cleaned up.");
  } catch (err) {
    console.error(err);
  }
};

export const findProductSvc = async (productId) => {
  const product = await Product.findById(productId);
  return product;
};