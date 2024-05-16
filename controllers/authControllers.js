import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import JWT from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    await User.create({ email, password: passwordHash, avatarURL });

    res.status(201).send({
      user: {
        email: email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = JWT.sign(payload, JWT_SECRET, {
      expiresIn: "23h",
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).send({
      token: token,
      user: {
        email: email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.send({
    email,
    subscription,
  });
};

export const subscription = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { subscription } = req.body;
  if (!["starter", "pro", "business"].includes(subscription)) {
    return res.status(400).json({
      message:
        "Please select a subscription from the available options: starter, pro, business",
    });
  }
  await User.findByIdAndUpdate(user.id, { subscription });

  res.send(user);
};

// const avatarPath = path.resolve("public", "avatars");

export const updateAvatar = async (req, res, next) => {
  try {
    const tmpUpload = req.file.path;
    const resultUpload = path.resolve("public/avatars", req.file.filename);
    await fs.rename(tmpUpload, resultUpload);
    const { id } = req.user;
    const { avatarURL } = req.file.filename;
    const user = await User.findByIdAndUpdate(id, avatarURL, { new: true });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    // const { path: tempUpload, originalname } = req.file;
    // // const filename = `${id}_${originalname}`;
    // const resultUpload = path.join(avatarPath, o);

    // const avatarURL = path.join("avatars", filename);
    // await User.findByIdAndUpdate(id, { avatarURL });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
