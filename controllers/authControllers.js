import "dotenv/config";
import crypto from "node:crypto";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import JWT from "jsonwebtoken";
import gravatar from "gravatar";
import { sendEmail } from "../helpers/emailOptions.js";

const { JWT_SECRET, LOCAL_HOST } = process.env;

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID();

    await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      html: `To confirm your email please go to the <a href="${LOCAL_HOST}/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open the link ${LOCAL_HOST}/users/verify/${verificationToken}`,
    };

    await sendEmail(verifyEmail);

    res.status(201).send({
      user: {
        email: email,
        subscription: "starter",
        avatarURL: avatarURL,
        verificationToken: verificationToken,
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

    if (user.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }

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
