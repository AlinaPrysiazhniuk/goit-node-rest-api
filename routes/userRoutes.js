import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { updateAvatar } from "../controllers/userControllers.js";
import { processAvatar } from "../middlewares/processAvatar.js";
import { verify, resendVerifyEmail } from "../controllers/userControllers.js";
import { emailSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";

const userRouter = express.Router();

userRouter.get("/verify/:verificationToken", verify);
userRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);
userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  processAvatar,
  updateAvatar
);

export default userRouter;
