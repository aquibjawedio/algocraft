import { Router } from "express";
import { healthController } from "../controllers/health.controller";

const healthRouter = Router();

healthRouter.route("/health").get(healthController);

export { healthRouter };
