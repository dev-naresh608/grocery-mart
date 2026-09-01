import mongoose from "mongoose";
import { pointSchema } from "../../utils/geo.schema.js";

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
    type: pointSchema,
    default: undefined,
    required: false,
  },
});

sellerSchema.pre("validate", function () {
  if (
    this.location &&
    (!this.location.coordinates ||
      !Array.isArray(this.location.coordinates) ||
      this.location.coordinates.length === 0)
  ) {
    this.location = undefined;
  }
});

sellerSchema.index({ location: "2dsphere" });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
