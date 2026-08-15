import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      role,
      type: "access",
    },
    config.auth.accessTokenSecret,
    {
      expiresIn: config.auth.accessTokenExpiresIn,
    },
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      type: "refresh",
    },
    config.auth.refreshTokenSecret,
    {
      expiresIn: config.auth.refreshTokenExpiresIn,
    },
  );
};