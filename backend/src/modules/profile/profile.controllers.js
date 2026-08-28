import User from "../user/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary, getCloudinaryPublicId } from "../../utils/cloudinary.js";
import bcrypt from "bcrypt";
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

    // Fetch existing user to get old profile picture URL for cleanup
    const existingUser = await User.findById(targetUserId);
    const oldImageUrl = existingUser?.profile_picture || existingUser?.imageUrl;

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

    // Return success response to user immediately
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      imageUrl: imageUrl,
      user: updatedUser,
    });

    // Background cleanup: Delete old image from Cloudinary if a previous image existed
    if (oldImageUrl && oldImageUrl !== imageUrl) {
      const oldPublicId = getCloudinaryPublicId(oldImageUrl);
      if (oldPublicId) {
        deleteFromCloudinary(oldPublicId)
          .then((result) => {
            if (!result || !result.success) {
              logFailedCloudinaryDeletion({
                userId: targetUserId,
                username: existingUser?.username,
                email: existingUser?.email,
                imageUrl: oldImageUrl,
                publicId: oldPublicId,
                error: result?.message || "Cloudinary deletion of old image returned unsuccessful status",
              });
            } else {
              console.log(`Successfully deleted previous profile picture from Cloudinary: ${oldPublicId}`);
            }
          })
          .catch((cloudError) => {
            logFailedCloudinaryDeletion({
              userId: targetUserId,
              username: existingUser?.username,
              email: existingUser?.email,
              imageUrl: oldImageUrl,
              publicId: oldPublicId,
              error: cloudError.message || cloudError,
            });
          });
      }
    }
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

export const updateAccountInfo = async (req, res) => {
  try {
    const { userId, username, email, phone } = req.body;
    const targetUserId = userId || req.user?._id || req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User record not found",
      });
    }

    const updateFields = {};

    // Single field dynamic checking: Only set fields explicitly provided in req.body
    if (username !== undefined) {
      if (!username || !username.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username cannot be empty",
        });
      }
      updateFields.username = username.trim();
    }

    if (email !== undefined) {
      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email address cannot be empty",
        });
      }
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== user.email?.toLowerCase()) {
        const existingEmailUser = await User.findOne({
          email: cleanEmail,
          _id: { $ne: targetUserId },
        });
        if (existingEmailUser) {
          return res.status(400).json({
            success: false,
            message: "This email is already registered to another account",
          });
        }
      }
      updateFields.email = cleanEmail;
    }

    if (phone !== undefined) {
      const cleanPhone = phone ? phone.trim() : "";
      if (cleanPhone && cleanPhone !== user.phone) {
        const existingPhoneUser = await User.findOne({
          phone: cleanPhone,
          _id: { $ne: targetUserId },
        });
        if (existingPhoneUser) {
          return res.status(400).json({
            success: false,
            message: "This phone number is already registered to another account",
          });
        }
      }
      updateFields.phone = cleanPhone;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Account information updated successfully",
      user: {
        ...updatedUser.toObject(),
        imageUrl: updatedUser.imageUrl || updatedUser.profile_picture || "",
      },
    });
  } catch (error) {
    console.error("Update account info error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update account information",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const targetUserId = userId || req.user?._id || req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 3) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 3 characters long",
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};
