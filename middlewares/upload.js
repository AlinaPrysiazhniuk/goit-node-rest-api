import multer from "multer";
import path from "path";
import crypto from "node:crypto";

// const tempDir = path.resolve("tmp");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //вказує в якій директорії має зберегтися файл
    cb(null, path.resolve("tmp"));
  },
  filename: (req, file, cb) => {
    //під яким іменем має зберегатися файл
    const extname = path.extname(file.originalname); // .png
    const basename = path.basename(file.originalname, extname); // TrevorPhilips-GTAV
    const suffix = crypto.randomUUID();

    console.log(`${basename}-${suffix}${extname}`);
    cb(null, `${basename}-${suffix}${extname}`);
  },
});

export const upload = multer({
  storage: storage,
});
