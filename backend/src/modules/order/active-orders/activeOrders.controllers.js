import {
  getActiveOrdersSvc,
  updateOrderStatusSvc,
  getAvailableDriverRequestsSvc,
  driverAcceptOrderSvc,
  driverRejectOrderSvc,
  retryDriverAllocationSvc,
} from "./activeOrders.service.js";

export const handleGetActiveOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const activeOrders = await getActiveOrdersSvc(userId, role);

    return res.json({
      success: true,
      message: "Active orders fetched",
      activeOrders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const updatedOrder = await updateOrderStatusSvc(orderId, updates);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DRIVER ALLOCATION CONTROLLERS =================

export const handleGetAvailableDriverRequests = async (req, res) => {
  try {
    const { driverId } = req.params;
    if (!driverId) {
      return res.status(400).json({ success: false, message: "Driver ID required" });
    }
    const requests = await getAvailableDriverRequestsSvc(driverId);
    return res.json({ success: true, requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDriverAcceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    if (!orderId || !driverId) {
      return res.status(400).json({ success: false, message: "orderId and driverId required" });
    }

    const result = await driverAcceptOrderSvc(orderId, driverId);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json({ success: true, message: "Order accepted successfully", order: result.order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDriverRejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    if (!orderId || !driverId) {
      return res.status(400).json({ success: false, message: "orderId and driverId required" });
    }

    const result = await driverRejectOrderSvc(orderId, driverId);
    return res.json({ success: true, message: "Order rejected by driver", order: result.order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleRetryDriverAllocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await retryDriverAllocationSvc(orderId);
    return res.json({ success: true, message: "Driver searching retried", order: result.order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
