import dotenv from "dotenv";
import app from "./app.js";
import { logger } from "@vidyaconnect/shared";
import { ensureSeedRoster } from "./seed/devRoster.seed.js";

dotenv.config();

const PORT = process.env.PORT || 3003;

async function start() {
  try {
    const schoolId = process.env.DEV_SCHOOL_ID || "dev-school-id";
    await ensureSeedRoster(schoolId);
  } catch (err) {
    logger.error("Seed failed", { error: err.message });
  }

  app.listen(PORT, () => {
    logger.info(
      "Server started",
      {
        service: "attendance-service",
        port: PORT
      }
    );
  });
}

start();