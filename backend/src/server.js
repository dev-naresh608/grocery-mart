import express from "express";
import mongoose from "mongoose";
import app from "./app.js";

const { connectDB, config } = require("./configs/index");

const startServer = async () => {
  await connectDB();

  app.listen(config.server.port || 5000, () => {
    console.log(`http://localhost:${config.server.port || 5000}`);
  });
};

startServer();
