import dotenv from "dotenv";
import app from "./app.js";
import { logger } from "@vidyaconnect/shared";

dotenv.config();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  logger.info(
    "Server started",
    {
      service: "attendance-service",
      port: PORT
    }
  );
});