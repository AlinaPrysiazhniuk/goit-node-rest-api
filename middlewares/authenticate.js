import HttpError from "../helpers/HttpError.js";
import JWT from "jsonwebtoken";
import { User } from "../models/user.js";

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization === "undefined") {
    return res.status(401).send("Invalid token");
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).send("Invalid token");
  }

  JWT.verify(token, JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send("Invalid token1");
    }

    req.user = {
      id: decode.id,
      email: decode.email,
    };

    next();
    // try {
    //   const user = await User.findById(decode.id);

    //   if (user === null) {
    //     throw HttpError(401, "Invalid token");
    //   }

    //   if (user.token !== token) {
    //     throw HttpError(401, "Invalid token");
    //   }
    //   console.log({ decode });

    //   console.log(req.user);
    // } catch (error) {
    //   next(error);
    // }
  });
};
