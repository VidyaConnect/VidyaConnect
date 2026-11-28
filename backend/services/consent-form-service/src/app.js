import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import consentFormRoutes from "./routes/consent-form.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/consent-forms", consentFormRoutes);

export default app;