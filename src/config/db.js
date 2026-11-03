import { MongoClient } from "mongodb";

let client;
const databaseName = process.env.MONGODB_DATABASE || "booknook";

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  const database = client.db(databaseName);
  await database.collection("borrows").createIndex(
    { bookId: 1, userEmail: 1 },
    { unique: true, name: "unique_active_borrow_per_user_and_book" },
  );

  console.log("Connected to MongoDB");
  return database;
}

export function getDB() {
  if (!client) {
    throw new Error("Database is not connected");
  }

  return client.db(databaseName);
}
