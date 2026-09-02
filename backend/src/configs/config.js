import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "DATABASE_URI",
  "PORT",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRE",
  "JWT_REFRESH_TOKEN_EXPIRE",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}`
  );
}

export const config = {
  env: process.env.NODE_ENV || "development",
  database: {
    uri: process.env.DATABASE_URI,
  },

  server: {
    port: Number(process.env.PORT),
  },

  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  services: {
    openRouterApiKey: process.env.OPEN_ROUTER_SERVICE_API_KEY,
  },
};