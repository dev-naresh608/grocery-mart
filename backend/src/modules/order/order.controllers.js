import Order from "./order.model.js";
import User from "../user/user.model.js";
import Product from "../product/product.model.js";
import Seller from "../seller/seller.model.js";

import { addOrderSvc, findSingleOrderSvc } from "./order.service.js";
import { createNotificationSvc } from "../notification/notification.service.js";

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
        allOrders = await Order.find({ customer_id: userId }).sort({ createdAt: -1 });
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
        }).sort({ createdAt: -1 });
        break;
      }
      default: {
        allOrders = await Order.find({
          $or: [{ customer_id: userId }, { store_id: userId }],
        }).sort({ createdAt: -1 });
        break;
      }
    }

    return res.json({
      success: true,
      message: "All orders",
      allOrders: allOrders || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAddOrder = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.customerId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to place an order.",
      });
    }
    const result = await addOrderSvc(payload);
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

    const result = await findSingleOrderSvc(orderId);
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

export const handleUpdateOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    });

    if (updatedOrder && updates.order_status && updatedOrder.customer_id) {
      const statusTitle =
        updates.order_status === "delivered"
          ? "Order Delivered!"
          : updates.order_status === "cancelled"
          ? "Order Cancelled"
          : `Order Status: ${updates.order_status.toUpperCase()}`;

      await createNotificationSvc({
        recipient: updatedOrder.customer_id,
        title: statusTitle,
        message: `Your order #${updatedOrder._id.toString().slice(-6)} is now ${updates.order_status}.`,
        type: updates.order_status === "delivered" ? "delivery" : "order",
        link: `/orders/${updatedOrder._id}`,
        metadata: { orderId: updatedOrder._id, status: updates.order_status },
      });
    }

    return res.json({
      success: true,
      message: "Updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};