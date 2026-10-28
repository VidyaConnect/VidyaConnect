import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 3009;

app.listen(port, () => {
  console.log(`communication-service listening on port ${port}`);
});