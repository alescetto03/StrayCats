import multer from "multer";
import path from "path";
import fs from "fs";

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const catId = req.body.catId;
    const uploadPath = `public/assets/${catId}`;

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // es: 162343.png
  }
});

export const upload = multer({ storage });