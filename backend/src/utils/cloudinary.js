import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
  localFilePath,
  folder = "novexa/products",
) => {
  try {
    if (!localFilePath) return null;

    //upload on cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    console.log("image uploaded on cloudinary");

    // await fs.unlink(localFilePath);

    return {
      success: true,
      message: "image uploaded successfully on cloudinary",
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
