const Product = require("../../modules/product/product.model");
const { Seller } = require("../../modules/seller/seller.model");
const Order = require("../../modules/order/order.model");

const addOrderService = async (o) => {
  try {
    let order = null;
    const { name:customer_name, phone:customer_phone } = o.order_address;
    await Order.create({
      customer_id: o.customerId,
      store_id: o.storeId,
      store_name: o.store_name,
      order_address: o.order_address,
      store_address: o.store_address,
      customer_name: customer_name,
      customer_phone: customer_phone,
      customer_email: o.email,
      order_items: o.items,
      order_status: o.order_status,
      createdAt: o.createdAt,
      payment_method: o.paymentMethod,
      price_detail: o.priceDetails,
    }).then((result) => {
      order = result;
    });
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

const findSingleOrderService = async (orderId) => {
  //fetch order.
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // const { order_items: product_ids } = order;

  //fetch product items.
  // const products = await Product.find({
  //   _id: { $in: product_ids },
  // });

  // console.log(products);

  // if (!products) {
  //   throw new Error("No order items found");
  // }

  // !  SELECT *
  // ! FROM PRODUCT
  // ! WHERE id IN ('A', 'C')
  // ! RESULT: [{}, {}];

  const { order_items } = order;
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

  // return {order, products};
  return order;
};

module.exports = {
  addOrderService,
  findSingleOrderService,
};
