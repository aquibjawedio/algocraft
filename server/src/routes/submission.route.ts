import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllSubmissionsController,
  getSubmissionByIdController,
} from "../controllers/submission.controller.js";

const submissionRouter = Router();

submissionRouter.route("/:slug/submissions").get(isLoggedIn, getAllSubmissionsController);
submissionRouter
  .route("/:slug/submissions/:submissionId")
  .get(isLoggedIn, getSubmissionByIdController);

export { submissionRouter };
