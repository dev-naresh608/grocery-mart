import { TAX_RATE, SHIPPING_FEE } from "../constants/cart.constants";

/**
 * Returns the effective unit price for a product (offer price if active offer, else selling price).
 * @param {Object} product - Product object.
 * @returns {number} Effective unit price.
 */
export const getEffectiveItemPrice = (product) => {
  if (!product) return 0;
  if (
    product.is_offer_available === true &&
    Number(product.product_offer_price) > 0
  ) {
    return Number(product.product_offer_price);
  }
  return Number(product.product_selling_price) || 0;
};

/**
 * Calculates cart totals based on items list using effective offer / regular prices.
 * @param {Array} cartItems - List of products in the cart.
 * @returns {Object} Total calculations: subTotal, subtotal, deliveryCharge, shippingPrice, taxPrice, finalPrice.
 */
export const calculateCartTotals = (cartItems = []) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      subTotal: 0,
      subtotal: 0,
      deliveryCharge: 0,
      shippingPrice: 0,
      taxPrice: 0,
      finalPrice: 0,
    };
  }

  const rawSubTotal = cartItems.reduce((acc, product) => {
    const qty = Number(product.product_qty) || 0;
    const price = getEffectiveItemPrice(product);
    return acc + price * qty;
  }, 0);

  const subTotal = Number(rawSubTotal.toFixed(2));
  const taxPrice = Number((subTotal * TAX_RATE).toFixed(2));
  const deliveryCharge = SHIPPING_FEE;
  const finalPrice = Number((subTotal + taxPrice + deliveryCharge).toFixed(2));

  return {
    subTotal,
    subtotal: subTotal,
    deliveryCharge,
    shippingPrice: deliveryCharge,
    taxPrice,
    finalPrice,
  };
};
