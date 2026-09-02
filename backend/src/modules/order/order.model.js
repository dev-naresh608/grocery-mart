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
    customer_phone: {
      type: String,
      default: "",
    },
    customer_email: {
      type: String,
      default: "",
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
    driver_allocation_status: {
      type: String,
      enum: ["unassigned", "searching", "assigned", "no_driver_available"],
      default: "unassigned",
    },
    rejected_driver_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    order_items: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order_status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "confirmed",
        "processing",
        "ready",
        "shipped",
        "out_for_delivery",
        "completed",
        "delivered",
        "rejected",
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

orderSchema.index({ customer_id: 1, createdAt: -1 });
orderSchema.index({ store_id: 1, createdAt: -1 });
orderSchema.index({ driver_id: 1, createdAt: -1 });
orderSchema.index({ order_status: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;