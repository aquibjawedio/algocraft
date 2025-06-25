import { Router } from "express";

// Imports from folders
import { healthController } from "../controllers/health.controller.js";

const healthRouter = Router();

healthRouter.route("/").get(healthController);

export { healthRouter };
