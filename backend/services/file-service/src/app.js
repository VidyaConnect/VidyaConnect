import express from "express";
import healthRoutes from "./routes/health.routes.js";
import s3TestRoutes from "./routes/s3-test.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/s3-test", s3TestRoutes);

export default app;