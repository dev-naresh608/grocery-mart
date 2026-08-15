import mongoose from "mongoose";

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

export default Customer = mongoose.model("Customer", customerSchema);
