import "dotenv/config";
import app from "./app.js";
import { logger } from "@vidyaconnect/shared";

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
