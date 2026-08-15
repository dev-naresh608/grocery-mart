import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import {
  User,
  createUserSvc,
  checkIsUserExistSvc,
  findUserByEmail,
  findUserByPhone,
  findUserById,
} from "../user/user.services.js";

import { Customer, createCustomerSvc } from "../customer/customer.services.js";
import { Driver, createDriverSvc } from "../driver/driver.services.js";
import { Seller, createSellerSvc } from "../seller/seller.services.js";
import { config } from "../../configs/config.js";

import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  phone: user.phone,
  profile_picture: user.profile_picture,
});

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      success: true,
      user: sanitizeUser(user),
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

  return {
    success: true,
    user: sanitizeUser(user),
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

  return {
    success: true,
    message: "User retrieved successfully",
    user: sanitizeUser(user),
  };
};

export const rotateTokenSvc = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const accessToken = generateAccessToken(user._id, user.role);

  const refreshToken = generateRefreshToken(user._id);

  return {
    success: true,
    user: sanitizeUser(user),
    message: "Token rotated successfully",
    accessToken,
    refreshToken,
  };
};

