import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
    store_name: {
      type: String,
      required: true,
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    order_address: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    store_address: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    customer_name: {
      type: String,
      required: true,
      default: "Unknown",
    },

    customer_details: {
      type: mongoose.Schema.Types.Mixed,
    },
    seller_details: {
      type: mongoose.Schema.Types.Mixed,
    },
    driver_details: {
      type: mongoose.Schema.Types.Mixed,
    },

    order_items: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order_status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    payment_method: {
      type: String,
      default: "cash",
    },
    price_detail: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;