import User from "../user/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary, getCloudinaryPublicId } from "../../utils/cloudinary.js";
import fs from "fs";
import path from "path";

// Helper function to log failed Cloudinary image deletions into cloudinary-dlt-img-log file
const logFailedCloudinaryDeletion = async (details) => {
  try {
    const logDirPath = path.join(process.cwd(), "src", "logs");
    if (!fs.existsSync(logDirPath)) {
      fs.mkdirSync(logDirPath, { recursive: true });
    }
    const logFilePath = path.join(logDirPath, "cloudinary-dlt-img-log.log");

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] FAILED CLOUDINARY IMAGE DELETION
User ID: ${details.userId}
Username: ${details.username || "N/A"}
Email: ${details.email || "N/A"}
Image URL: ${details.imageUrl || "N/A"}
Public ID: ${details.publicId || "N/A"}
Error: ${details.error}
--------------------------------------------------------------------------------\n`;

    await fs.promises.appendFile(logFilePath, logMessage, "utf8");
    console.error(`Logged Cloudinary deletion failure to ${logFilePath}`);
  } catch (logErr) {
    console.error("Failed to write to cloudinary-dlt-img-log file:", logErr);
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = userId || req.user?._id || req.user?.id;

    if (!targetUserId) {
      if (req.file && fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file to upload",
      });
    }

    // Validation 1: Check file mimetype (must be an image)
    if (!req.file.mimetype.startsWith("image/")) {
      if (fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Please upload a valid image (JPG, PNG, WEBP).",
      });
    }

    // Validation 2: Check file size (max 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
      if (fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB. Please choose a smaller image.",
      });
    }

    // Upload to Cloudinary under folder "novexa/users"
    const uploadResult = await uploadOnCloudinary(req.file.path, "novexa/users");

    if (!uploadResult || !uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: uploadResult?.message || "Failed to upload profile picture to Cloudinary",
      });
    }

    const imageUrl = uploadResult.url;

    // Update user document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { profile_picture: imageUrl, imageUrl: imageUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      imageUrl: imageUrl,
      user: updatedUser,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while processing profile picture upload",
    });
  }
};

export const removeProfilePicture = async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = userId || req.user?._id || req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to remove profile picture",
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User record not found",
      });
    }

    const currentImageUrl = user.profile_picture || user.imageUrl;

    if (!currentImageUrl) {
      return res.status(400).json({
        success: false,
        message: "No profile picture exists to remove",
      });
    }

    // Step 1: Update Database FIRST
    let updatedUser;
    try {
      updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { profile_picture: "", imageUrl: "" },
        { new: true }
      ).select("-password");
    } catch (dbError) {
      console.error("Database update error while removing profile picture:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to remove profile picture from database",
      });
    }

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to remove profile picture from database",
      });
    }

    // Step 2: Database update succeeded! Return success response to user immediately
    res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      user: updatedUser,
      imageUrl: "",
    });

    // Step 3: Attempt Cloudinary deletion in background. If it fails, write log to file!
    const publicId = getCloudinaryPublicId(currentImageUrl);
    if (publicId) {
      deleteFromCloudinary(publicId)
        .then((result) => {
          if (!result || !result.success) {
            logFailedCloudinaryDeletion({
              userId: targetUserId,
              username: user.username,
              email: user.email,
              imageUrl: currentImageUrl,
              publicId: publicId,
              error: result?.message || "Cloudinary deletion returned unsuccessful status",
            });
          } else {
            console.log(`Successfully deleted image from Cloudinary: ${publicId}`);
          }
        })
        .catch((cloudError) => {
          logFailedCloudinaryDeletion({
            userId: targetUserId,
            username: user.username,
            email: user.email,
            imageUrl: currentImageUrl,
            publicId: publicId,
            error: cloudError.message || cloudError,
          });
        });
    }
  } catch (error) {
    console.error("Remove profile picture error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove profile picture from database",
    });
  }
};
