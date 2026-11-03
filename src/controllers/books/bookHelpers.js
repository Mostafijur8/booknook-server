// Provides shared MongoDB and validation helpers for the book controllers.
import { ObjectId } from "mongodb";
import { getDB } from "../../config/db.js";

// Returns the MongoDB books collection.
export const books = () => getDB().collection("books");

// Checks whether a string is a valid MongoDB ObjectId.
export function isValidId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// Escapes special characters so search input is treated as plain text.
export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
