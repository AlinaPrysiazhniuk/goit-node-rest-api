import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";

export const processAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400, "No file uploaded"));
  }

  const { path: tempPath, filename } = req.file;
  const outputPath = path.join("public/avatars", filename);

  try {
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(outputPath);
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error("Failed to delete temp file:", err);
      }
    });
    req.file.path = outputPath;
    next();
  } catch (error) {
    next(error);
  }
};
