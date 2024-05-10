import express from "express";
import {
  register,
  login,
  logout,
  current,
} from "../controllers/authControllers.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, current);

export default authRouter;
