import multer from "multer";
import * as path from "node:path";
import { Config } from "../index";
import dayjs from "dayjs";

// Store uploaded image to a temporary folder
const storage = multer.diskStorage({
  destination: "./temp",
  filename: (req, file, cb) => {
    cb(null, `${ dayjs().format("YYYYMMDDHHmmss").toString() }-${ Math.round(Math.random() * 1E9) }${ path.extname(file.originalname) }`);
  }
});

export const upload = multer({ storage });