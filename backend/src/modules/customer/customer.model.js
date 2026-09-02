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
  myWishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
  ],
});

customerSchema.index({ user_id: 1 });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;