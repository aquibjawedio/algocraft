import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";

// Importing routes
import { healthRouter } from "./routes/health.route";
import { authRouter } from "./routes/auth.route";

// Importing middlewares
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle all routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);

// Handle error middleware

app.use(errorHandler);

export { app };
