import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    product_url: {
      type: String,
      required: true,
    },
    product_public_id: {
      type: String,
      required: true,
    },
    product_weight: {
      type: Number,
      required: true,
    },
    product_weight_type: {
      type: String,
      default: "none",
    },
    product_selling_price: {
      type: Number,
      required: true,
    },
    product_cost_price: {
      type: Number,
      required: true,
    },
    product_offer_price: {
      type: Number,
      default: 0,
    },
    product_description: {
      type: String,
      required: true,
    },

    is_product_in_stock: {
      type: Boolean,
      default: true,
    },
    show_in_menu: {
      type: Boolean,
      default: true,
    },
    is_offer_available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

productSchema.index({ store_id: 1 });
productSchema.index({ store_id: 1, show_in_menu: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
