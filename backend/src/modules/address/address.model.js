import mongoose from "mongoose";
import { pointSchema } from "../../utils/geo.schema.js";

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    location: {
      type: pointSchema,
      required: true,
    },
  },
  { timestamps: true },
);

addressSchema.index({ user_id: 1, updatedAt: -1 });
addressSchema.index({ location: "2dsphere" });
const Address = mongoose.model("Address", addressSchema);
export default Address;
