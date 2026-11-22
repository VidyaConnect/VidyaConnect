import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

// Allowed browser origins, read when each request arrives (so .env values are used).
const allowedOrigins = () =>
  (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || allowedOrigins().includes(origin)),
  })
);
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/reports", reportRoutes);

export default app;
