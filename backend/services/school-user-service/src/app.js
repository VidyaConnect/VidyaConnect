import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "school-user-service",
    status: "UP"
  });
});

export default app;