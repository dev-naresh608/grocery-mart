import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

cartSchema.index({ customer_id: 1 });
cartSchema.index({ customer_id: 1, product_id: 1 });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;