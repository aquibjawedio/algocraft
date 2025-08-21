import { Router } from "express";
import {
  calculateTimeAndSpaceController,
  runCodeController,
  submitCodeController,
} from "../controllers/execution.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const executionRouter = Router();

executionRouter.route("/run").post(isLoggedIn, runCodeController);
executionRouter.route("/submit").post(isLoggedIn, submitCodeController);
executionRouter.route("/complexity").patch(isLoggedIn, calculateTimeAndSpaceController);

export { executionRouter };
