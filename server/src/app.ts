import express from "express";
import { healthRouter } from "./routes/health.route.js";

const app = express();

// Handling All Routes Here
app.use("/api/v1/health", healthRouter);

export { app };
