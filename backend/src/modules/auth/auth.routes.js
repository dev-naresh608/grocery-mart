import express from "express";
const router = express.Router();

import { register, login, getMe, rotateToken } from "./auth.controllers.js";

import {
  authenticateAccessToken,
  authenticateRefreshToken,
} from "../../middlewares/auth.middleware.js";

import { validate } from "../../middlewares/validate.middleware.js";

import { loginSchema, registerSchema } from "./auth.schema.js";

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", authenticateAccessToken, getMe);

router.post(
  "/rotate-token",
  authenticateRefreshToken,
  rotateToken
);

router.post("/logout", );

module.exports = {
  authRoute: router,
};
