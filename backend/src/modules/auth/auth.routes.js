const express = require("express");
const router = express.Router();

const authController = require("./auth.controllers.js");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/refresh-token", authController.refreshToken);
router.get("/get-me", authController.getMe);
router.get("/logout",authController.logout);
router.get("/logout-all",authController.logoutAll);

module.exports = {
  authRoute: router,
};
