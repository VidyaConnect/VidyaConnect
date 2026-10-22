import express from "express";
import { errorHandler } from "@vidyaconnect/shared";
import healthRoutes from "./routes/health.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === (process.env.WEB_ORIGIN || "http://localhost:3000")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/files", fileRoutes);

app.use(errorHandler);

export default app;
