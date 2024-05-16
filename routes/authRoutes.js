import express from "express";
import {
  register,
  login,
  logout,
  current,
  subscription,
  updateAvatar,
  getAvatar,
} from "../controllers/authControllers.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, current);
authRouter.patch("/", authenticate, subscription);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);
authRouter.get("/avatars", authenticate, getAvatar);

export default authRouter;
