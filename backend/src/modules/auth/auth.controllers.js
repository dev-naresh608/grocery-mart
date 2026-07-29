const jwt = require("jsonwebtoken");
const { config } = require("../../configs");
const {
  userLoginSvc,
  userSignupSvc,
  getMeSvc,
  refreshTokenSvc,
  logoutSvc,
  logoutAllSvc,
} = require("./auth.service");
const { validateSignup, validateLogin } = require("./auth.validation");

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const signup = async (req, res) => {
  try {
    const payload = req.body;
    const validation = validateSignup(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const ip = req.ip || req.socket?.remoteAddress || "Not provided";
    const userAgent = req.headers["user-agent"] || "Not provided";

    const response = await userSignupSvc(payload, ip, userAgent);

    if (!response || !response.success) {
      return res.status(400).json(
        response || { success: false, message: "Signup failed" }
      );
    }

    const { accessToken, refreshToken, user } = response;

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const payload = req.body;
    const validation = validateLogin(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const { email, password } = payload;
    const ip = req.ip || req.socket?.remoteAddress || "Not provided";
    const userAgent = req.headers["user-agent"] || "Not provided";

    const response = await userLoginSvc(email, password, ip, userAgent);

    if (!response || !response.success) {
      return res.status(401).json(
        response || { success: false, message: "Login failed" }
      );
    }

    const { accessToken, refreshToken, user } = response;

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authorization token not provided",
      });
    }

    const response = await getMeSvc(accessToken);

    if (!response || !response.success) {
      return res.status(401).json(
        response || { success: false, message: "Invalid access token" }
      );
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.headers["x-refresh-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    const ip = req.ip || req.socket?.remoteAddress || "Not provided";
    const userAgent = req.headers["user-agent"] || "Not provided";

    const response = await refreshTokenSvc(token, ip, userAgent);

    if (!response || !response.success) {
      res.clearCookie("refreshToken", getCookieOptions());
      return res.status(401).json(
        response || { success: false, message: "Failed to refresh token" }
      );
    }

    const { accessToken, refreshToken: newRefreshToken, user } = response;

    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getCookieOptions());
    }

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.headers["x-refresh-token"];

    if (token) {
      await logoutSvc(token);
    }

    res.clearCookie("refreshToken", getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    let userId = req.user?.id || req.body?.userId;

    if (!userId) {
      const authHeader = req.headers.authorization;
      const accessToken =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

      if (accessToken) {
        try {
          const decoded = jwt.verify(accessToken, config.JWT_SECRET);
          userId = decoded.id;
        } catch (err) {
          // Token verification failed
        }
      }
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to logout all sessions",
      });
    }

    const response = await logoutAllSvc(userId);

    res.clearCookie("refreshToken", getCookieOptions());

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  getMe,
  logout,
  logoutAll,
};
