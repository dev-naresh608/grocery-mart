import express from "express";
import { uploadProfilePicture, removeProfilePicture } from "./profile.controllers.js";
import { upload } from "../../middlewares/multer.middleware.js";

const profileRouter = express.Router();

profileRouter.post(
  "/upload-picture",
  upload.single("image"),
  uploadProfilePicture
);

profileRouter.post("/remove-picture", removeProfilePicture);

export default profileRouter;
