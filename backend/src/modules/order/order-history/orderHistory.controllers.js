import Order from "../order.model.js";
import Seller from "../../seller/seller.model.js";
import { addOrderService, findSingleOrderService } from "./orderHistory.service.js";

const HISTORICAL_STATUSES = ["completed", "delivered", "rejected", "cancelled"];

export const handleGetAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let allOrders = [];

    switch (role) {
      case "customer": {
        allOrders = await Order.find({
          customer_id: userId,
          order_status: { $in: HISTORICAL_STATUSES },
        }).sort({ createdAt: -1 });
        break;
      }
      case "seller": {
        let sellerStoreId = userId;
        const seller = await Seller.findOne({
          $or: [{ _id: userId }, { user_id: userId }],
        });
        if (seller) {
          sellerStoreId = seller._id;
        }
        allOrders = await Order.find({
          $or: [{ store_id: userId }, { store_id: sellerStoreId }],
          order_status: { $in: HISTORICAL_STATUSES },
        }).sort({ createdAt: -1 });
        break;
      }
      case "driver": {
        allOrders = await Order.find({
          driver_id: userId,
          order_status: { $in: HISTORICAL_STATUSES },
        }).sort({ createdAt: -1 });
        break;
      }
      default: {
        allOrders = await Order.find({
          $or: [
            { customer_id: userId },
            { store_id: userId },
            { driver_id: userId },
          ],
          order_status: { $in: HISTORICAL_STATUSES },
        }).sort({ createdAt: -1 });
        break;
      }
    }

    return res.json({
      success: true,
      message: "Order history",
      allOrders: allOrders || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAddOrder = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Payload is required",
      });
    }
    const result = await addOrderService(payload);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: result.order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const handleFindOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const result = await findSingleOrderService(orderId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleDeleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndDelete(orderId);
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
