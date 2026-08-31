import Seller from "../seller/seller.model.js";
import Product from "../product/product.model.js";
import { paginate, getPaginationParams } from "../../utils/pagination.js";

export const handleGetAllStores = async (req, res) => {
  try {
    const { page, limit, search } = getPaginationParams(req);
    const query = search
      ? { store_name: { $regex: search, $options: "i" } }
      : {};

    const paginated = await paginate(Seller, query, {
      page,
      limit,
      select:
        "_id user_id store_name store_address store_type logo_url banner_url rating is_active",
    });

    return res.status(200).json({
      success: true,
      message: "All stores fetched successfully",
      result: paginated.data,
      stores: paginated.data,
      pagination: paginated.pagination,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handlegetAllStoreProduct = async (req, res) => {
  try {
    const store_id = req.params.storeId;
    const { page, limit } = getPaginationParams(req);

    if (!store_id) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required",
        result: [],
        pagination: null,
      });
    }

    let sellerStoreId = store_id;
    const seller = await Seller.findOne({
      $or: [{ _id: store_id }, { user_id: store_id }],
    });
    if (seller) {
      sellerStoreId = seller._id;
    }

    const filter = {
      $or: [{ store_id: store_id }, { store_id: sellerStoreId }],
    };

    const paginated = await paginate(Product, filter, { page, limit });

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      result: paginated.data,
      products: paginated.data,
      pagination: paginated.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching store products: " + error.message,
      result: [],
      pagination: null,
    });
  }
};

export const handleGetOneStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Seller.findOne({
      $or: [{ _id: storeId }, { user_id: storeId }],
    });

    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
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
