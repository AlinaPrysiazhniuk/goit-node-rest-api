import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";

export const processAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
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

    console.log("avatar");
  } catch (error) {
    next(error);
  }
};
