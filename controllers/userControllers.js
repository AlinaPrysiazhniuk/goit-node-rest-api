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

export const verify = async (req, res, next) => {
  const { token } = req.params;
  console.log(token);

  try {
    const user = await User.findOne({ verifyToken: token });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verifyToken: null,
    });

    res.send({ message: "Email confirm successfully" });
  } catch (error) {
    next(error);
  }
};
