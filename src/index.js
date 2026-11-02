import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to BookNook Server!");
});

await connectDB();

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`BookNook server running on port ${port}`);
  });
}

export default app;
