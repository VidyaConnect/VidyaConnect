import express from "express";
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import schoolRoutes from "./routes/school.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);

export default app;