import express from "express";
import { errorHandler } from "@vidyaconnect/shared";
import healthRoutes from "./routes/health.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/attendance", attendanceRoutes);

app.use(errorHandler);

export default app;
