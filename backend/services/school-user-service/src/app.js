import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import authRoutes from "./routes/auth.routes.js";
import childrenRoutes from "./routes/children.routes.js";
import bulkRegistrationRoutes from "./routes/bulkRegistration.routes.js";
import academicsRoutes from "./routes/academics.routes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8081"],
  credentials: true,
}));

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/children", childrenRoutes);
app.use("/api/bulk-registration", bulkRegistrationRoutes);
app.use("/api/academics", academicsRoutes);

// Error handler: must stay AFTER all the routes above.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 && !err.status ? "Something went wrong" : err.message,
  });
});

export default app;