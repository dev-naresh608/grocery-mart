const { User } = require("../user");
const {
  userLoginSvc,
  userSignupSvc,
  getMeSvc,
  refreshTokenSvc,
} = require("./auth.service");

const signup = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res
        .status(401)
        .json({ success: false, message: "Please send some data" });
    }

    if (!payload.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const ip = req.ip || "Not provided";
    const userAgent = req.headers["user-agent"] || "Not provided";

    const response = await userSignupSvc(payload, ip, userAgent);

    if (!response || response.success === false) {
      return res
        .status(400)
        .json(response || { success: false, message: "Signup failed" });
    }

    const { accessToken, refreshToken, user } = response;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      return res
        .status(400)
        .json({ success: false, message: "Please send some data" });
    }
    const { email, password } = payload;

     const ip = req.ip || "Not provided";
    const userAgent = req.headers["user-agent"] || "Not provided";
    const response = await userLoginSvc(email, password,ip,userAgent);

    if (!response || !response.success) {
      return res
        .status(200)
        .json(response || { success: false, message: "Login failed" });
    }

    const { accessToken, refreshToken, user } = response;

    // SET COOKIE
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    const response = await getMeSvc(accessToken);

    if (!response) {
      return res.status(401).json({
        success: false,
        message: "Invalid Access token",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong, E: ${error.message}`,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(401).json({
        message: "Email  or Password not provided",
      });
    }

    const { email, password } = req.body;

    const response = await refreshTokenSvc(email, password);

    if (!response || response.success === false) {
      return res.status(401).json(response || { message: "User not found" });
    }

    const { accessToken, refreshToken, user } = response;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days.
    });

    res.status(200).json({
      success: true,
      message: "Token changed successsfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong, E: ${error.message}`,
    });
  }
};

const logout = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong, E: ${error.message}`,
    });
  }
};

const logoutAll = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong, E: ${error.message}`,
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
