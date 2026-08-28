import Seller from "../seller/seller.model.js";
import Product from "../product/product.model.js";

export const handleGetAllStores = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { store_name: { $regex: search, $options: "i" } } : {};

    const allSellers = await Seller.find(query);

    if (!allSellers || allSellers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No stores available",
        result: [],
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
      .json({ success: true, message: "All stores fetched successfully", result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handlegetAllStoreProduct = async (req, res) => {
  try {
    const store_id = req.params.storeId;

    if (!store_id) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required",
        result: null,
      });
    }

    let sellerStoreId = store_id;
    const seller = await Seller.findOne({ $or: [{ _id: store_id }, { user_id: store_id }] });
    if (seller) {
      sellerStoreId = seller._id;
    }

    const result = await Product.find({
      $or: [{ store_id: store_id }, { store_id: sellerStoreId }],
    });

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      result: result || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching store products",
      result: null,
    });
  }
};

export const handleGetOneStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Seller.findOne({ $or: [{ _id: storeId }, { user_id: storeId }] });

    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      store,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
