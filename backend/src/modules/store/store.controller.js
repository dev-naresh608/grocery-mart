import Seller from "../seller/seller.model.js";
import Product from "../product/product.model.js";
import Order from "../order/order.model.js";
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
        "_id user_id store_name store_address store_type logo_url banner_url rating is_active is_store_open",
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
      if (seller.is_store_open === false) {
        return res.status(200).json({
          success: true,
          message: "Store is currently closed",
          result: [],
          products: [],
          is_store_closed: true,
          pagination: null,
        });
      }
    }

    const { includeHidden } = req.query;
    const filter = {
      $or: [{ store_id: store_id }, { store_id: sellerStoreId }],
    };

    if (includeHidden !== "true") {
      filter.show_in_menu = { $ne: false };
    }

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

export const handleToggleStoreStatus = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { is_store_open } = req.body;

    if (is_store_open === undefined) {
      return res.status(400).json({
        success: false,
        message: "is_store_open boolean flag is required in request body",
      });
    }

    const seller = await Seller.findOne({
      $or: [{ _id: storeId }, { user_id: storeId }],
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // If seller attempts to DEACTIVATE the store (set is_store_open = false)
    if (is_store_open === false || is_store_open === "false") {
      // Check if store has any active orders in progress
      const activeOrdersCount = await Order.countDocuments({
        store_id: seller._id,
        order_status: {
          $in: [
            "pending",
            "preparing",
            "confirmed",
            "processing",
            "ready",
            "shipped",
            "out_for_delivery",
          ],
        },
      });

      if (activeOrdersCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot deactivate store while you have ${activeOrdersCount} active ${
            activeOrdersCount === 1 ? "order" : "orders"
          } in progress. Please complete or resolve all current orders first.`,
          activeOrdersCount,
        });
      }
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      seller._id,
      { $set: { is_store_open: Boolean(is_store_open) } },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      message: updatedSeller.is_store_open
        ? "Store is now Active and accepting orders"
        : "Store is now Inactive / Closed",
      store: updatedSeller,
      is_store_open: updatedSeller.is_store_open,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update store status",
    });
  }
};
