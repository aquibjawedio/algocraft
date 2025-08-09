import { Router } from "express";
import {
  loginController,
  logutController,
  refreshAccessTokenController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerController);
authRouter.route("/verify-email/:token").get(verifyEmailController);
authRouter.route("/login").post(loginController);
authRouter.route("/logout").post(isLoggedIn, logutController);
authRouter.route("/refresh").post(refreshAccessTokenController);

export { authRouter };
