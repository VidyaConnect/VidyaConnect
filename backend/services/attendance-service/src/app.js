import express from "express";
import { errorHandler } from "@vidyaconnect/shared";
import healthRoutes from "./routes/health.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/attendance", attendanceRoutes);

app.use(errorHandler);

export default app;
