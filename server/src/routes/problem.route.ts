import { Router } from "express";
import {
  createProblemController,
  getAllProblemsController,
  getProblemBySlugController,
} from "../controllers/problem.controller.js";
import { isContributor, isLoggedIn } from "../middlewares/auth.middleware.js";

const problemRouter = Router();

problemRouter
  .route("/")
  .post(isLoggedIn, isContributor, createProblemController)
  .get(getAllProblemsController);

problemRouter.route("/:slug").get(getProblemBySlugController);

export { problemRouter };
