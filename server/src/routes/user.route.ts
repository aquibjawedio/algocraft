import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getUserProfileController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/profile").get(isLoggedIn, getUserProfileController);

export { userRouter };
