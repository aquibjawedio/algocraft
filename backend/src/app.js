import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Imports from folders
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { healthRouter } from "./routes/health.route.js";
import { authRouter } from "./routes/auth.route.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handling all routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);

// Custom middlewares
app.use(errorHandler);

export { app };
