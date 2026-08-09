import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/api/announcements", announcementRoutes);

export default app;
