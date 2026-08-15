import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

// const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const uploadPath = path.join(__dirname, "../temporaryUploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      return cb(null, uploadPath);
    } catch (error) {
      return error;
    }
  },
  filename: function (req, file, cb) {
    try {
      const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10)}-${file.originalname}`;
      return cb(null, uniqueName);
    } catch (error) {
      return error;
    }

    // dlt temp files.
    // fs.unlinkSync(`../temporaryUploads/${uniqueName}`);
  },
});

// (uniqueName) && fs.unlinkSync(`../temporaryUploads/${uniqueName}`)

export const upload = multer({
  storage,
});
