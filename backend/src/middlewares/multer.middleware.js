import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(), "src", "temporaryUploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (error) {
      cb(error, uploadPath);
    }
  },
  filename: function (req, file, cb) {
    try {
      const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.originalname}`;
      cb(null, uniqueName);
    } catch (error) {
      cb(error, file.originalname);
    }
  },
});

export const upload = multer({
  storage,
});
