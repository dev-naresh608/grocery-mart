import bcrypt from "bcrypt";
import mongoose from "mongoose";

import {
  createUserSvc,
  findUserByEmail,
  findUserByPhone,
  findUserById,
} from "../user/user.services.js";

import User from "../user/user.model.js";
import Customer from "../customer/customer.model.js";
import Seller from "../seller/seller.model.js";
import Driver from "../driver/driver.model.js";

import { createCustomerSvc } from "../customer/customer.services.js";
import { createDriverSvc } from "../driver/driver.services.js";
import { createSellerSvc } from "../seller/seller.services.js";

import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

const getUserWithRoleDetails = async (user) => {
  if (!user) return null;
  let roleDetails = {};

  try {
    if (user.role === "seller") {
      const seller = await Seller.findOne({ user_id: user._id });
      if (seller) {
        roleDetails = {
          store_id: seller._id,
          store_name: seller.store_name,
          store_owner_name: seller.store_owner_name,
          store_type: seller.store_type,
          store_address: seller.store_address,
          is_store_open: seller.is_store_open,
        };
      }
    } else if (user.role === "driver") {
      const driver = await Driver.findOne({ user_id: user._id });
      if (driver) {
        roleDetails = {
          driver_status: driver.status ?? driver.driver_status ?? true,
          driver_dob: driver.dob ?? driver.driver_dob,
          driver_vehicle_number: driver.vehicle_number ?? driver.driver_vehicle_number,
          driver_aadhaar_number: driver.aadhaar_number ?? driver.driver_aadhaar_number,
        };
      }
    } else if (user.role === "customer") {
      const customer = await Customer.findOne({ user_id: user._id });
      if (customer) {
        roleDetails = {
          myCart: customer.myCart || [],
          myWishlist: customer.myWishlist || [],
          myOrders: customer.myOrders || [],
        };
      }
    }
  } catch (err) {
    console.error("Failed fetching role details:", err);
  }

  return {
    id: user._id,
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profile_picture: user.profile_picture,
    ...roleDetails,
  };
};

export const registerSvc = async (payload) => {
  const isUserExistWithEmail = await findUserByEmail(payload.email);

  if (isUserExistWithEmail) {
    return {
      success: false,
      message: "Email already registered",
    };
  }

  const isUserExistWithPhone = await findUserByPhone(payload.phone);

  if (isUserExistWithPhone) {
    return {
      success: false,
      message: "Phone number already registered",
    };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const userPayload = {
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    role: payload.role,
    phone: payload.phone,
  };

  const dbSession = await mongoose.startSession();

  try {
    let user;

    await dbSession.withTransaction(async () => {
      user = await createUserSvc(userPayload, dbSession);

      switch (payload.role) {
        case "customer":
          await createCustomerSvc(user._id, dbSession);
          break;

        case "seller":
          await createSellerSvc(user._id, payload, dbSession);
          break;

        case "driver":
          await createDriverSvc(user._id, payload, dbSession);
          break;

        default:
          throw new Error("Invalid user role");
      }
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    const userWithDetails = await getUserWithRoleDetails(user);

    return {
      success: true,
      user: userWithDetails,
      accessToken,
      refreshToken,
      message: "Account created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Signup failed",
    };
  } finally {
    await dbSession.endSession();
  }
};

export const loginSvc = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return { success: false, message: "Invalid email or password" };
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  const userWithDetails = await getUserWithRoleDetails(user);

  return {
    success: true,
    user: userWithDetails,
    message: "User logged in successfully",
    accessToken,
    refreshToken,
  };
};

export const getMeSvc = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const userWithDetails = await getUserWithRoleDetails(user);

  return {
    success: true,
    message: "User retrieved successfully",
    user: userWithDetails,
  };
};

export const rotateTokenSvc = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  const userWithDetails = await getUserWithRoleDetails(user);

  return {
    success: true,
    user: userWithDetails,
    message: "Token rotated successfully",
    accessToken,
    refreshToken,
  };
};
