import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";


const app = express();
const port = 5000;

app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Welcome to BookNook Server! hello world!");
});

// Vercel invokes the exported Express app as a serverless function.

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
