import Order from "../order.model.js";
import Seller from "../../seller/seller.model.js";
import User from "../../user/user.model.js";
import Driver from "../../driver/driver.model.js";
import { createNotificationSvc } from "../../notification/notification.service.js";

const ACTIVE_STATUSES = ["pending", "preparing", "confirmed", "processing", "shipped", "ready", "out_for_delivery"];

// Helper to resolve seller user ID
const getSellerUserId = async (storeId) => {
  if (!storeId) return null;
  const seller = await Seller.findOne({
    $or: [{ _id: storeId }, { user_id: storeId }],
  });
  return seller?.user_id || seller?._id || storeId;
};

export const getActiveOrdersSvc = async (userId, role) => {
  let query = {};

  switch (role) {
    case "customer": {
      query = {
        customer_id: userId,
        order_status: {
          $in: [
            ...ACTIVE_STATUSES,
            "rejected",
            "cancelled",
          ],
        },
      };
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
      query = {
        $or: [{ store_id: userId }, { store_id: sellerStoreId }],
        order_status: { $in: ACTIVE_STATUSES },
      };
      break;
    }
    case "driver": {
      query = {
        driver_id: userId,
        order_status: { $in: ACTIVE_STATUSES },
      };
      break;
    }
    default: {
      query = {
        $or: [{ customer_id: userId }, { store_id: userId }],
        order_status: { $in: ACTIVE_STATUSES },
      };
    }
  }

  const activeOrders = await Order.find(query).sort({ createdAt: -1 });
  return activeOrders || [];
};

export const updateOrderStatusSvc = async (orderId, updates) => {
  const existingOrder = await Order.findById(orderId);
  if (!existingOrder) return null;

  // Block moving to ready/out_for_delivery if no driver is assigned!
  if (["ready", "shipped", "out_for_delivery"].includes(updates.order_status)) {
    if (!existingOrder.driver_id || existingOrder.driver_allocation_status !== "assigned") {
      throw new Error("Cannot dispatch order without an assigned driver! Please wait for a driver to accept.");
    }
  }

  // If moving to preparing, trigger driver searching
  if (updates.order_status === "preparing") {
    updates.driver_allocation_status = "searching";
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
    new: true,
  });

  if (!updatedOrder) return null;

  // If order reaches terminal status, free up the driver (is_busy = false)
  if (
    updatedOrder.driver_id &&
    ["delivered", "completed", "cancelled", "rejected"].includes(updates.order_status)
  ) {
    await User.findByIdAndUpdate(updatedOrder.driver_id, { is_busy: false });
    await Driver.findOneAndUpdate({ user_id: updatedOrder.driver_id }, { is_busy: false });
  }

  const orderIdShort = updatedOrder._id.toString().slice(-6).toUpperCase();

  // 1. Notify Customer
  if (updatedOrder.customer_id && updates.order_status) {
    const statusTitle =
      updates.order_status === "delivered"
        ? "🎉 Order Delivered!"
        : updates.order_status === "out_for_delivery"
        ? "🚚 Out for Delivery"
        : updates.order_status === "cancelled"
        ? "❌ Order Cancelled"
        : updates.order_status === "rejected"
        ? "⚠️ Order Rejected"
        : `Order Status: ${updates.order_status.toUpperCase()}`;

    await createNotificationSvc({
      recipient: updatedOrder.customer_id,
      title: statusTitle,
      message: `Your order #${orderIdShort} status updated to ${updates.order_status}.`,
      type: updates.order_status === "delivered" ? "delivery" : "order",
      link: `/orders/${updatedOrder._id}`,
      metadata: { orderId: updatedOrder._id, status: updates.order_status },
    });
  }

  // 2. Notify Seller / Store User
  const sellerUserId = await getSellerUserId(updatedOrder.store_id);
  if (sellerUserId && updates.order_status) {
    await createNotificationSvc({
      recipient: sellerUserId,
      title: `Order #${orderIdShort} Update`,
      message: `Order #${orderIdShort} is now marked as ${updates.order_status}.`,
      type: "order",
      link: `/active-orders`,
      metadata: { orderId: updatedOrder._id, status: updates.order_status },
    });
  }

  // 3. Notify Driver if assigned
  if (updatedOrder.driver_id && updates.order_status) {
    await createNotificationSvc({
      recipient: updatedOrder.driver_id,
      title: `Trip Update #${orderIdShort}`,
      message: `Order #${orderIdShort} status changed to ${updates.order_status}.`,
      type: "delivery",
      link: `/active-orders`,
      metadata: { orderId: updatedOrder._id, status: updates.order_status },
    });
  }

  return updatedOrder;
};

// ================= DRIVER ALLOCATION SERVICES =================

// Get available requests for a driver (only if driver is not busy with another active trip)
export const getAvailableDriverRequestsSvc = async (driverId) => {
  // 1. Check if driver is already busy with an active ongoing trip
  const existingActiveTrip = await Order.findOne({
    driver_id: driverId,
    order_status: { $in: ACTIVE_STATUSES },
  });

  if (existingActiveTrip) {
    return [];
  }

  // 2. Fetch broadcasted requests for non-busy driver
  const requests = await Order.find({
    order_status: { $in: ["preparing", "processing", "confirmed"] },
    driver_id: null,
    driver_allocation_status: "searching",
    rejected_driver_ids: { $ne: driverId },
  }).sort({ createdAt: -1 });

  return requests || [];
};

// Driver accepts order
export const driverAcceptOrderSvc = async (orderId, driverId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { success: false, message: "Order not found" };
  }

  // 1. Check if driver already has an active ongoing trip
  const existingActiveTrip = await Order.findOne({
    driver_id: driverId,
    order_status: { $in: ACTIVE_STATUSES },
  });

  if (existingActiveTrip && String(existingActiveTrip._id) !== String(orderId)) {
    return {
      success: false,
      message: "You already have an active delivery trip in progress! Complete your current delivery first.",
    };
  }

  if (order.driver_id && String(order.driver_id) !== String(driverId)) {
    return { success: false, message: "Order already accepted by another driver" };
  }

  const driverUser = await User.findById(driverId);
  const driverRecord = await Driver.findOne({ user_id: driverId });

  const driverDetails = {
    driver_name: driverUser?.username || "Driver",
    driver_phone: driverUser?.phone || driverRecord?.phone || "N/A",
    vehicle_number: driverRecord?.vehicle_number || "MH-01-AB-1234",
  };

  order.driver_id = driverId;
  order.driver_allocation_status = "assigned";
  order.driver_details = driverDetails;
  await order.save();

  // Mark driver as busy
  await User.findByIdAndUpdate(driverId, { is_busy: true });
  await Driver.findOneAndUpdate({ user_id: driverId }, { is_busy: true });

  const orderIdShort = order._id.toString().slice(-6).toUpperCase();

  // 1. Notify Customer
  if (order.customer_id) {
    await createNotificationSvc({
      recipient: order.customer_id,
      title: "Driver Assigned!",
      message: `${driverDetails.driver_name} (+91 ${driverDetails.driver_phone}) has been assigned to your order #${orderIdShort}.`,
      type: "order",
      link: `/orders/${order._id}`,
      metadata: { orderId: order._id, driverDetails },
    });
  }

  // 2. Notify Seller / Store
  const sellerUserId = await getSellerUserId(order.store_id);
  if (sellerUserId) {
    await createNotificationSvc({
      recipient: sellerUserId,
      title: "Driver Found!",
      message: `${driverDetails.driver_name} (+91 ${driverDetails.driver_phone}) accepted delivery for Order #${orderIdShort}.`,
      type: "order",
      link: `/active-orders`,
      metadata: { orderId: order._id, driverDetails },
    });
  }

  // 3. Notify Driver
  await createNotificationSvc({
    recipient: driverId,
    title: "Trip Confirmed!",
    message: `You accepted delivery trip #${orderIdShort} for ${order.store_name}.`,
    type: "delivery",
    link: `/active-orders`,
    metadata: { orderId: order._id },
  });

  return { success: true, order };
};

// Driver rejects order
export const driverRejectOrderSvc = async (orderId, driverId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { success: false, message: "Order not found" };
  }

  if (!order.rejected_driver_ids.includes(driverId)) {
    order.rejected_driver_ids.push(driverId);
  }

  // Count available drivers who are NOT busy
  const availableDriversCount = await User.countDocuments({
    role: "driver",
    is_busy: { $ne: true },
  });

  const orderIdShort = order._id.toString().slice(-6).toUpperCase();

  // If all non-busy drivers rejected this order
  if (order.rejected_driver_ids.length >= (availableDriversCount || 1)) {
    order.driver_allocation_status = "no_driver_available";

    // Notify seller & customer
    if (order.customer_id) {
      await createNotificationSvc({
        recipient: order.customer_id,
        title: "Order Status Update",
        message: `Currently searching for available drivers for your order #${orderIdShort}.`,
        type: "order",
        link: `/orders/${order._id}`,
        metadata: { orderId: order._id },
      });
    }

    const sellerUserId = await getSellerUserId(order.store_id);
    if (sellerUserId) {
      await createNotificationSvc({
        recipient: sellerUserId,
        title: "⚠️ No Driver Available",
        message: `No drivers are currently available for Order #${orderIdShort}. You can retry driver search from Kanban board.`,
        type: "order",
        link: `/active-orders`,
        metadata: { orderId: order._id },
      });
    }
  }

  await order.save();
  return { success: true, order };
};

// Retry driver allocation
export const retryDriverAllocationSvc = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { success: false, message: "Order not found" };
  }

  order.rejected_driver_ids = [];
  order.driver_allocation_status = "searching";
  await order.save();

  return { success: true, order };
};
