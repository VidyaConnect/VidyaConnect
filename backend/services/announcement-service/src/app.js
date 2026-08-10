import express from "express";
import healthRoutes from "./routes/health.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/announcements", announcementRoutes);

export default app;