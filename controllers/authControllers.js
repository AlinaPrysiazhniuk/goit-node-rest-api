import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user !== null) {
      return res.status(409).send("User already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({ email, password: passwordHash });
    console.log({ result });
    res.status(201).send("Registration succesfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(401).send("Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).send("Email or password is incorrect");
    }
    res.send("Login");
  } catch (error) {
    next(error);
  }

  res.send("login");
};
