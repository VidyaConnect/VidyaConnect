import express from "express";
import cors from "cors";
import { errorHandler } from "@vidyaconnect/shared";
import communicationRoutes from "./routes/communication.routes.js";

const app = express();

// Dev: allow the web preview of the mobile app and the teacher web portal.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", service: "communication-service" }));
app.use("/api/communication", communicationRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

export default app;