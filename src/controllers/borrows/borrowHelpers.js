import { ObjectId } from "mongodb";
import { getDB } from "../../config/db.js";

// Returns the MongoDB borrows collection.
export const borrows = () => getDB().collection("borrows");

// Returns the MongoDB books collection.
export const books = () => getDB().collection("books");

// Checks whether a string is a valid MongoDB ObjectId.
export function isValidId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}
