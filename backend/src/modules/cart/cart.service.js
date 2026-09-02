import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const getCartByUserIdSvc = async (userId) => {
  if (!userId) return [];
  const items = await Cart.find({ customer_id: userId })
    .populate("product_id")
    .lean();

  const formattedItems = [];
  const orphanedIds = [];

  for (const item of items) {
    // If the product was deleted by the seller, cleanup the orphaned cart item
    if (!item.product_id) {
      orphanedIds.push(item._id);
      continue;
    }

    formattedItems.push({
      _id: item.product_id._id,
      product_name: item.product_id.product_name,
      product_url: item.product_id.product_url,
      product_selling_price: item.product_id.product_selling_price,
      product_offer_price: item.product_id.product_offer_price,
      is_offer_available: item.product_id.is_offer_available,
      product_weight: item.product_id.product_weight,
      product_weight_type: item.product_id.product_weight_type,
      product_qty: item.quantity,
      store_id: item.store_id,
    });
  }

  // Non-blocking cleanup of orphaned items
  if (orphanedIds.length > 0) {
    Cart.deleteMany({ _id: { $in: orphanedIds } }).catch((err) =>
      console.error("Cleanup orphaned cart items error:", err),
    );
  }

  return formattedItems;
};

export const addToCartSvc = async (
  userId,
  productId,
  storeId,
  quantity = 1,
) => {
  let item = await Cart.findOne({ customer_id: userId, product_id: productId });

  if (item) {
    item.quantity += Number(quantity);
    await item.save();
  } else {
    item = await Cart.create({
      customer_id: userId,
      product_id: productId,
      store_id: storeId,
      quantity: Number(quantity),
    });
  }

  return item;
};

export const updateCartQtySvc = async (userId, productId, quantity) => {
  const item = await Cart.findOneAndUpdate(
    { customer_id: userId, product_id: productId },
    { $set: { quantity: Number(quantity) } },
    { new: true },
  );
  return item;
};

export const removeFromCartSvc = async (userId, productId) => {
  const result = await Cart.findOneAndDelete({
    customer_id: userId,
    product_id: productId,
  });
  return result;
};

export const clearCartSvc = async (userId) => {
  const result = await Cart.deleteMany({ customer_id: userId });
  return result;
};

export const getCartItemSvc = async (productId) => {
  const product = await Product.findById(productId);
  return product;
};
