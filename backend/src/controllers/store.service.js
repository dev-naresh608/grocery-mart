import Seller from "../modules/seller/seller.model.js";

import Product from "../modules/product/product.model.js";

export const getAllProductsSvc = async (store_id) => {
  const products = await Product.find({ store_id: store_id });

  return products;
};

export const getOneStoreSvc = async (store_id) => {
  const store = await Seller.findOne({ _id: store_id });
  return store;
};