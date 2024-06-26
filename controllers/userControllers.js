import "dotenv/config";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";
import path from "path";
import { sendEmail } from "../helpers/emailOptions.js";

const { LOCAL_HOST } = process.env;

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
    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  console.log(verificationToken);

  try {
    const user = await User.findOne({ verificationToken: verificationToken });

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: "Email confirm successfully" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      html: `To confirm your email please go to the <a href="${LOCAL_HOST}/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your email please open the link ${LOCAL_HOST}/users/verify/${user.verificationToken}`,
    };

    await sendEmail(verifyEmail);

    res.status(201).send({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
