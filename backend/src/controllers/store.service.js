const Product = require("../modules/product/product.model");
const { Seller } = require("../modules/seller/seller.model");
const getAllProductsService = async (store_id) => {
  const products = await Product.find({ store_id: store_id });

  return products;
};

const getOneStoreService = async (store_id) => {
  const store = await Seller.findOne({ _id: store_id });
  return store;
};

module.exports = {
  getAllProductsService,
  getOneStoreService
};
