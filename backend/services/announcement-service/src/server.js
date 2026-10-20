import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  console.log("==================================");
  console.log("Announcement Service Started");
  console.log("Port:", PORT);
  console.log("==================================");
});

server.on("error", (err) => {
  console.error(err);
});

process.on("exit", (code) => {
  console.log("Process exited with code:", code);
});