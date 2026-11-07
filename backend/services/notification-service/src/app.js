import express from "express";
import healthRoutes from "./routes/health.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;