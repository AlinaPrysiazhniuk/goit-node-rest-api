import { User } from "../models/user.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user !== null) {
      return res.status(409).send("User already register");
    }

    const result = await User.create({ email, password });
    console.log({ result });
    res.send("register");
  } catch (error) {
    next(error);
  }
};
