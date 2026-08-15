import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["customer", "seller", "driver", "admin"],
    default: "customer",
  },
  profile_picture: {
    type: String,
  },
  phone: {
    type: String,
  },
});

export default User = mongoose.model("User", userSchema);
