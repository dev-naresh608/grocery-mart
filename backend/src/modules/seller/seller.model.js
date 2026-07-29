const mongoose = require("mongoose");
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
});

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = { Seller };
