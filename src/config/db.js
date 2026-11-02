import { MongoClient } from "mongodb";

let client;

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  console.log("Connected to MongoDB");
  return client.db();
}

export function getDB() {
  if (!client) {
    throw new Error("Database is not connected");
  }

  return client.db();
}
