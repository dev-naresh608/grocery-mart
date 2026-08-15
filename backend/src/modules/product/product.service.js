import fs from "fs";
import path from "path";

import Seller from "../seller/seller.model.js"
import Product from "./product.model.js";
import User from "../user/user.model.js";

export const addProductService = async (payload, url, product_id) => {
  const {
    store_id,
    product_name,
    // product_url,
    product_weight,
    product_weight_type,
    product_cost_price,
    product_selling_price,
    product_offer_price,
    product_description,
  } = payload;

  if (!store_id) {
    return { success: false, message: "Store id missing" };
  }

  const product = await Product.create({
    store_id: store_id,
    product_name: product_name,
    product_url: url,
    product_public_id: product_id,
    product_weight: product_weight,
    product_weight_type: product_weight_type,
    product_cost_price: product_cost_price,
    product_selling_price: product_selling_price,
    product_offer_price: product_offer_price,
    product_description: product_description,
  });

  const data = (await Seller.findById(store_id)) || "nothing";
  const user = await User.findById(data.user_id);

  const res = await Seller.findOne().populate("user_id");

  // const userData = {
  //   ...product.toObject(),
  //   ...user.toObject(),
  // };
  return {
    success: true,
    message: "Product added successfully",
  };
};

export const updateProductService = async (product_id, store_id, updates) => {
  // console.log(updates);
  // return product;

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

const product = await Product.findOneAndUpdate(
    {
      _id: product_id,
      store_id: store_id,
    },
    {
      $set: filteredUpdates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return filteredUpdates;
};

export const deleteProductService = async (product_id, store_id) => {
  const result = await Product.findOneAndDelete({
    _id: product_id,
    store_id: store_id,
  });

  if (!result) {
    return {
      success: false,
      message: "product is not deleted",
    };
  }
  const { _id } = result;
  return _id;
};

export const deleteTempFolder = async () => {
  const folderPath = path.join(__dirname, "../../temporaryUploads");
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log("Folder deleted safely.");
  } catch (err) {
    console.error(err);
  }
};

export const findProductSvc = async (productId) => {
  const product = await Product.findById({
    _id: productId,
  });
  return product;
};