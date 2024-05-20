import multer from "multer";
import path from "path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const suffix = crypto.randomUUID();

    cb(null, `${suffix}${extname}`);
  },
});

export const upload = multer({
  storage: storage,
});
