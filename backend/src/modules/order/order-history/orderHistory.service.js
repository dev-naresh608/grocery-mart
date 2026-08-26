import Order from "../order.model.js";
import Product from "../../product/product.model.js";
import Seller from "../../seller/seller.model.js";
import Cart from "../../cart/cart.model.js";
import { createNotificationSvc } from "../../notification/notification.service.js";

export const addOrderSvc = async (o) => {
  try {
    const { name: customer_name, phone: customer_phone } = o.order_address || {};

    // Resolve seller store ID (o.storeId could be User._id or Seller._id)
    let sellerStoreId = o.storeId;
    if (o.storeId) {
      const seller = await Seller.findOne({
        $or: [{ _id: o.storeId }, { user_id: o.storeId }],
      });
      if (seller) {
        sellerStoreId = seller._id;
      }
    }

    const order = await Order.create({
      customer_id: o.customerId,
      store_id: sellerStoreId,
      store_name: o.store_name,
      order_address: o.order_address,
      store_address: o.store_address,
      customer_name: customer_name || "Customer",
      customer_phone: customer_phone || "",
      customer_email: o.email || "",
      order_items: o.items || [],
      order_status: o.orderStatus || "pending",
      createdAt: o.createdAt || new Date(),
      payment_method: o.paymentMethod || "cashOnDelivery",
      price_detail: o.priceDetails || {},
    });

    // Clear user cart in DB after successful order placement
    if (o.customerId) {
      await Cart.deleteMany({ customer_id: o.customerId });
      
      // Create notification for customer
      await createNotificationSvc({
        recipient: o.customerId,
        title: "Order Placed Successfully",
        message: `Your order #${order._id.toString().slice(-6)} has been placed with ${o.store_name || "the store"}. Total: ₹${o.priceDetails?.finalPrice || order.price_detail?.finalPrice || 0}.`,
        type: "order",
        link: `/orders/${order._id}`,
        metadata: { orderId: order._id, status: order.order_status },
      });
    }

    // Create notification for Seller / Store
    let sellerUserId = sellerStoreId;
    const sellerRecord = await Seller.findById(sellerStoreId);
    if (sellerRecord && sellerRecord.user_id) {
      sellerUserId = sellerRecord.user_id;
    }
    if (sellerUserId) {
      await createNotificationSvc({
        recipient: sellerUserId,
        title: "🛒 New Incoming Order!",
        message: `New order #${order._id.toString().slice(-6)} received from ${customer_name}. Total: ₹${o.priceDetails?.finalPrice || order.price_detail?.finalPrice || 0}.`,
        type: "order",
        link: `/active-orders`,
        metadata: { orderId: order._id, status: order.order_status },
      });
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const findSingleOrderSvc = async (orderId) => {
  let order = await Order.findById(orderId).populate("customer_id", "username email phone");
  if (!order) {
    return null;
  }

  const orderObj = order.toObject();

  // Populate customer phone & email fallback if empty
  orderObj.customer_name =
    orderObj.customer_name ||
    orderObj.customer_id?.username ||
    orderObj.order_address?.name ||
    "Customer";

  orderObj.customer_phone =
    orderObj.customer_phone ||
    orderObj.customer_id?.phone ||
    orderObj.order_address?.phone ||
    orderObj.customer_details?.phone ||
    "N/A";

  orderObj.customer_email =
    orderObj.customer_email ||
    orderObj.customer_id?.email ||
    orderObj.customer_details?.email ||
    "N/A";

  const { order_items } = orderObj;
  if (order_items && Array.isArray(order_items)) {
    const updatedOrderItems = order_items.map(
      ({
        _id,
        product_name,
        product_url,
        product_weight,
        product_weight_type,
        product_selling_price,
        product_qty,
        product_offer_price,
      }) => ({
        _id,
        product_name,
        product_url,
        product_weight,
        product_weight_type,
        product_selling_price,
        product_qty,
        product_offer_price,
      }),
    );
    orderObj.order_items = updatedOrderItems;
  }

  return orderObj;
};
