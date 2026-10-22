import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import classRoutes from "./routes/class.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN || "http://localhost:3000", credentials: true, allowedHeaders: ["Content-Type", "Authorization"], methods: ["GET", "POST", "PATCH", "OPTIONS"] }));
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/classes", classRoutes);
app.use(errorHandler);
export default app;
