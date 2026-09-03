import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.database.uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ DB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.error("👉 Please verify your DATABASE_URI in Render environment variables and ensure MongoDB Atlas Network Access allows 0.0.0.0/0 (anywhere).");
  }
};

export default connectDB;
