import dotenv from "dotenv";
dotenv.config();


import app from "./app.js";
import { logger } from "@vidyaconnect/shared";



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(
    "Server started",
    {
      service: "school-user-service",
      port: PORT
    }
  );
});