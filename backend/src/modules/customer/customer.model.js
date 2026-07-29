const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = { Customer };
