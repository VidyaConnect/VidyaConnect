import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3002",
  credentials: true,
}));

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/auth", authRoutes);

export default app;