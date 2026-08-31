import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
  },
  store_name: {
    type: String,
    required: true,
  },
  store_owner_name: {
    type: String,
  },
  store_type: {
    type: String,
    required: true,
  },
  store_address: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  is_store_open: {
    type: Boolean,
    default: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

sellerSchema.index({ location: "2dsphere" });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
