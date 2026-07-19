import dotenv from "dotenv";
import app from "./app.js";
import { logger } from "@vidyaconnect/shared";

dotenv.config();

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  logger.info(
    "Server started",
    {
      service: "report-service",
      port: PORT
    }
  );
});