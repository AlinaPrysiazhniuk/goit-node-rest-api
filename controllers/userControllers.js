import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";
import path from "path";

export const updateAvatar = async (req, res, next) => {
  try {
    const tmpUpload = req.file.path;
    const resultUpload = path.resolve("public/avatars", req.file.filename);

    await fs.rename(tmpUpload, resultUpload);
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(
      id,
      { avatarURL: path.join("/avatars", req.file.filename) },
      { new: true }
    );
    if (user === null) {
      throw HttpError(401, "Not authorized");
    }
    console.log(user.avatarURL);
    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
