import express from "express";
import mongoose from "mongoose";
import app from "./app.js";

import { config } from "./configs/config.js";
import connectDB from "./configs/database.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.server.port || 5000, () => {
    console.log(`http://localhost:${config.server.port || 5000}`);
  });
};

startServer();
