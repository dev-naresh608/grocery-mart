import mongoose from "mongoose";
import { pointSchema } from "../../utils/geo.schema.js";

const driverSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
  },
  dob: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  is_busy: {
    type: Boolean,
    default: false,
  },
  aadhaar_number: {
    type: Number,
    required: true,
  },
  vehicle_number: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: pointSchema,
    default: undefined,
    required: false,
  },
});

driverSchema.pre("validate", function () {
  if (
    this.currentLocation &&
    (!this.currentLocation.coordinates ||
      !Array.isArray(this.currentLocation.coordinates) ||
      this.currentLocation.coordinates.length === 0)
  ) {
    this.currentLocation = undefined;
  }
});

driverSchema.index({ currentLocation: "2dsphere" });

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
