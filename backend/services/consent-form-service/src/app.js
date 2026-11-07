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

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Request body must contain valid JSON" });
  }
  return next(error);
});

export default app;