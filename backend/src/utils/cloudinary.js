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
