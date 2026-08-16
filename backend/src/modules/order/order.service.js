import Order from "./order.model.js";
import Product from "../product/product.model.js";
import Seller from "../seller/seller.model.js";
import Cart from "../cart/cart.model.js";

export const addOrderService = async (o) => {
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

export const findSingleOrderService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const { order_items } = order;
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
    order.order_items = updatedOrderItems;
  }

  return order;
};
