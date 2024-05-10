import HttpError from "../helpers/HttpError.js";
import JWT from "jsonwebtoken";
import { User } from "../models/user.js";

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized1" });
  }

  try {
    const { id } = JWT.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      throw new HttpError(401, "Not authorized");
    }

    if (user.token !== token) {
      throw new HttpError(401, "Not authorized1");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
