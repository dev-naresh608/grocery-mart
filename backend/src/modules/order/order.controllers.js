import Order from "./order.model.js";
import User from "../user/user.model.js";
import Product from "../product/product.model.js";

import { addOrderService, findSingleOrderService } from "./order.service.js";

export const handleGetAllOrders = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.query;

  if (!userId) {
    return res.status(200).json({
      success: false,
      message: "User id required",
    });
  }

  let AllOrders = "";

  switch (role) {
    case "customer": {
      allOrders = await Order.find({ customer_id: userId });
      break;
    }
    case "seller": {
      allOrders = await Order.find({ store_id: userId });
      break;
    }
    default: {
      return res.status(400).json({
        success: false,
        message: "Who are you !!",
      });
    }
  }
  // const allOrders = await Order.find({ cfg: userId });

  if (!allOrders || allOrders.length === 0) {
    return res.status(200).json({
      success: false,
      message: "No order found",
    });
  }

  return res.json({
    success: true,
    message: "All orders",
    allOrders,
  });
};

export const handleAddOrder = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(200).json({
        success: false,
        message: "Payload is required",
      });
    }
    const result = await addOrderService(payload);
    if (!result.success) {
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }
    return res.status(201).json({
      success: true,
      message: "order places succssfully",
      order: result.order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something happen wrong",
      error,
    });
  }
};

export const handleFindOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id required",
      });
    }

    const result = await findSingleOrderService(orderId);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "order is not fetched",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order Fetched Successfully",
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
  return res.json({ message: "deleted successfully" });
};

export const handleUpdateOrderById = async (req, res) => {
  return res.json({ message: "Updated successfully" });
};