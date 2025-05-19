import multer from "multer";
import * as path from "node:path";

// Store uploaded image to a temporary folder
const storage = multer.diskStorage({
  destination: "./temp/",
  filename: (req, file, cb) => {
    cb(null, `${ file.filename }-${ Date.now() }-${ Math.round(Math.random() * 1E9) }.${ path.extname(file.originalname) }`);
  }
});

export const upload = multer({ storage });