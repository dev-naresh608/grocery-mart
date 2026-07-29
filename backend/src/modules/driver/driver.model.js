const mongoose = require("mongoose");
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

const Driver = mongoose.model("Driver", driverSchema);
module.exports = { Driver };
