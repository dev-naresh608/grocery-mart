import mongoose from "mongoose";

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
  aadhaar_number: {
    type: Number,
    required: true,
  },
  vehicle_number: {
    type: String,
    required: true,
  },
});

export default Driver = mongoose.model("Driver", driverSchema);
