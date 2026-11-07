import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/announcements", announcementRoutes);


app.get("/test123", (req, res) => {
  res.json({ message: "This is my current announcement service" });
});

export default app;