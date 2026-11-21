import express from "express";
import cors from "cors";
import { errorHandler } from "@vidyaconnect/shared";
import healthRoutes from "./routes/health.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://127.0.0.1:8081",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/calendar", eventRoutes);

app.use(errorHandler);

export default app;