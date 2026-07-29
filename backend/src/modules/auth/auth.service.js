const { User, createUserSvc, checkIsUserExistSvc } = require("../user/index");
const { Customer, createCustomerSvc } = require("../customer/index");
const { Driver, createDriverSvc } = require("../driver/index");
const { Seller, createSellerSvc } = require("../seller/index");
const sessionSvc = require("./session.service");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { config } = require("../../configs");

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  profile_picture: user.profile_picture || "",
});

const userSignupSvc = async (payload, ip, userAgent) => {
  const isUserExist = await checkIsUserExistSvc(payload.email);
  if (isUserExist) {
    return {
      success: false,
      message: "Email already registered",
    };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const userPayload = { ...payload, password: hashedPassword };

  const dbSession = await mongoose.startSession();

  try {
    let user;
    let accessToken;
    let refreshToken;

    await dbSession.withTransaction(async () => {
      user = await createUserSvc(userPayload, dbSession);

      const role = payload.role || "customer";
      switch (role) {
        case "customer":
          await createCustomerSvc(user._id, dbSession);
          break;
        case "seller":
          await createSellerSvc(user._id, payload, dbSession);
          break;
        case "driver":
          await createDriverSvc(user._id, payload, dbSession);
          break;
        case "admin":
          break;
        default:
          throw new Error("Invalid user role");
      }

      refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "7d" }
      );

      await sessionSvc.createSessionSvc(
        {
          user: user._id,
          refreshToken,
          ip,
          userAgent,
        },
        dbSession
      );

      accessToken = jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "15m" }
      );
    });

    return {
      success: true,
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
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

const userLoginSvc = async (email, password, ip, userAgent) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await sessionSvc.createSessionSvc({
      user: user._id,
      refreshToken,
      ip,
      userAgent,
    });

    return {
      success: true,
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return { success: false, message: error.message || "Login failed" };
  }
};

const getMeSvc = async (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      message: "User retrieved successfully",
      user: sanitizeUser(user),
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid or expired access token",
    };
  }
};

const refreshTokenSvc = async (refreshToken, ip, userAgent) => {
  try {
    if (!refreshToken) {
      return { success: false, message: "Refresh token is required" };
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (err) {
      return { success: false, message: "Invalid or expired refresh token" };
    }

    const activeSession = await sessionSvc.findSessionByRefreshTokenSvc(
      refreshToken
    );

    if (!activeSession) {
      return {
        success: false,
        message: "Session expired or revoked. Please log in again.",
      };
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Revoke old session and issue rotated refresh token for optimal security
    await sessionSvc.revokeSessionSvc(refreshToken);

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await sessionSvc.createSessionSvc({
      user: user._id,
      refreshToken: newRefreshToken,
      ip,
      userAgent,
    });

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: sanitizeUser(user),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to refresh token",
    };
  }
};

const logoutSvc = async (refreshToken) => {
  if (!refreshToken) {
    return { success: false, message: "Refresh token is required" };
  }

  const result = await sessionSvc.revokeSessionSvc(refreshToken);
  if (!result) {
    return {
      success: false,
      message: "Session already logged out or invalid",
    };
  }

  return {
    success: true,
    message: "Logged out successfully",
  };
};

const logoutAllSvc = async (userId) => {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  await sessionSvc.revokeAllUserSessionsSvc(userId);

  return {
    success: true,
    message: "Logged out of all devices successfully",
  };
};

module.exports = {
  userLoginSvc,
  userSignupSvc,
  getMeSvc,
  refreshTokenSvc,
  logoutSvc,
  logoutAllSvc,
};
