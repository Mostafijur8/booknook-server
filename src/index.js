import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to BookNook Server!");
});

try {
  await connectDB();

  app.listen(port, () => {
    console.log(`BookNook server running on port ${port}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
