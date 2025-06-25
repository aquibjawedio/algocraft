import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

// Imports from folders
import { errorHandler } from "./middlewares/error.middleware.js";
import { healthRouter } from "./routes/health.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

// Custom middlewares
app.use(errorHandler);

export { app };
