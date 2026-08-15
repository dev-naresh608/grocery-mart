import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
  "DATABASE_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "OPEN_ROUTER_SERVICE_API_KEY",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
}

export const config = {
  database: {
    uri: process.env.DATABASE_URI,
  },

  server: {
    port: Number(process.env.PORT) || 5000,
  },

  auth: {
    accessTokenSecret: requiredEnv("JWT_ACCESS_TOKEN_SECRET"),
    refreshTokenSecret: requiredEnv("JWT_REFRESH_TOKEN_SECRET"),

    accessTokenExpiresIn: requiredEnv("JWT_ACCESS_TOKEN_EXPIRE"),
    refreshTokenExpiresIn: requiredEnv("JWT_REFRESH_TOKEN_EXPIRE"),
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
