const mongoose = require("mongoose");
const {config} = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.DATABASE_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`DB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

module.exports = {connectDB};