import express from "express";
import { errorHandler } from "@vidyaconnect/shared";
import healthRoutes from "./routes/health.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/files", fileRoutes);

app.use(errorHandler);

export default app;