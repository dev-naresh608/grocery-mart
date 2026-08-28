import { config } from "../configs/config.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

if (config.cloudinary.cloudName && config.cloudinary.apiKey) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export const getCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return null;
  }
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let pathAfterUpload = parts[1];
    // Strip version prefix if present e.g. v12345678/
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");
    // Strip file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (err) {
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return { success: false, message: "No public ID provided" };

    if (
      !config.cloudinary.cloudName ||
      config.cloudinary.cloudName === "your_cloud_name" ||
      !config.cloudinary.apiKey
    ) {
      console.warn("Cloudinary credentials missing. Simulating Cloudinary delete fallback.");
      return { success: true, message: "Mock deletion success" };
    }

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok" || result.result === "not found") {
      return { success: true, message: "Image deleted from Cloudinary", result };
    } else {
      return { success: false, message: `Cloudinary returned status: ${result.result}`, result };
    }
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return { success: false, message: error.message || "Failed to delete image from Cloudinary" };
  }
};

export const uploadOnCloudinary = async (
  localFilePath,
  folder = "novexa/products",
) => {
  try {
    if (!localFilePath) return null;

    // Fallback if Cloudinary credentials are not configured
    if (
      !config.cloudinary.cloudName ||
      config.cloudinary.cloudName === "your_cloud_name" ||
      !config.cloudinary.apiKey
    ) {
      console.warn("Cloudinary credentials missing. Processing image fallback.");
      const fileBuffer = await fs.promises.readFile(localFilePath);
      const base64Image = `data:image/png;base64,${fileBuffer.toString("base64")}`;
      if (fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath).catch(() => {});
      }
      return {
        success: true,
        message: "Image processed successfully",
        url: base64Image,
        public_id: `local_${Date.now()}`,
      };
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath).catch(() => {});
    }

    return {
      success: true,
      message: "Image uploaded successfully on Cloudinary",
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (localFilePath && fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath).catch(() => {});
    }
    return {
      success: false,
      message: error.message || "Failed to upload image",
    };
  }
};
