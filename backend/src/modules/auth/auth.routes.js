const express = require("express");
const router = express.Router();

const authController = require("./auth.controllers.js");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAll);
router.get("/get-me", authController.getMe);

module.exports = {
  authRoute: router,
};
