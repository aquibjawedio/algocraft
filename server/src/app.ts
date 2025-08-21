import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";

// Importing middlewares
import { errorHandler } from "./middlewares/error.middleware";

// Importing routes
import { healthRouter } from "./routes/health.route";
import { authRouter } from "./routes/auth.route";
import { userRouter } from "./routes/user.route";
import { problemRouter } from "./routes/problem.route";
import { executionRouter } from "./routes/execution.route";
import { submissionRouter } from "./routes/submission.route";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
app.set("trust proxy", true);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle all routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/problems", submissionRouter);
app.use("/api/v1/execution", executionRouter);

// Handle error middleware

app.use(errorHandler);

export { app };
