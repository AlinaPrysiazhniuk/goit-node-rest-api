import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { updateAvatar } from "../controllers/userControllers.js";
import { processAvatar } from "../middlewares/processAvatar.js";

const userRouter = express.Router();

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  processAvatar,
  updateAvatar
);

export default userRouter;