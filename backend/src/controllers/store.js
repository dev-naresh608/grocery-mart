import Seller from "../modules/seller/seller.model.js";

import Product from "../modules/product/product.model.js";

import { getAllProductsService, getOneStoreService } from "./store.service.js";

export const handleGetAllStores = async (req, res) => {
  const { search } = req.query;
  const query = search ? { store_name: { $regex: search, $options: "i" } } : {};

  const allSellers = await Seller.find(query);

  if (!allSellers) {
    return res.status(400).json({
      success: false,
      message: "No restaurants are available",
    });
  }

  const allProducts = await Product.find({});

  if (!allProducts) {
    return res.status(400).json({
      success: false,
      message: "No products found",
    });
  }

  const result = allSellers.map(
    ({ _id, user_id, store_name, store_address, store_type }) => ({
      _id,
      user_id,
      store_name,
      store_address,
      store_type,
    }),
  );

  return res
    .status(200)
    .json({ success: true, message: "all restaurants are fetched", result });
};

export const handlegetAllStoreProduct = async (req, res) => {
  try {
    const store_id = req.params.storeId;

    if (!store_id) {
      return res.status(400).json({
        success: false,
        message: "Store id is required",
        result: null,
      });
    }

    const result = await getAllProductsService(store_id);

    return res.status(200).json({
      success: true,
      message: "all products fethced successfully",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong in database",
      result: error,
    });
  }
};

export const handleGetOneStore = async (req, res) => {
  const { storeId } = req.params;

  const store = await getOneStoreService(storeId);

  return res.status(200).json({
    success: true,
    message: "store fetched successfully",
    store,
  });
};
