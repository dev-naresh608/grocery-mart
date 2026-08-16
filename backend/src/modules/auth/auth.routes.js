import express from "express";

import {
  register,
  login,
  getMe,
  rotateToken,
  logout,
} from "./auth.controllers.js";

import {
  authenticateAccessToken,
  authenticateRefreshToken,
} from "../../middlewares/auth.middleware.js";

import { validate } from "../../middlewares/validate.middleware.js";

import { loginSchema, registerSchema } from "./auth.schema.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);

authRouter.post("/login", validate(loginSchema), login);

authRouter.get("/me", authenticateAccessToken, getMe);

authRouter.post("/rotate-token", authenticateRefreshToken, rotateToken);

authRouter.post("/logout", logout);

export default authRouter;
