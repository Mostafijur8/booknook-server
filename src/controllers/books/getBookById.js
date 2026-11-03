// Handles the endpoint for retrieving one book by ID.
import { ObjectId } from "mongodb";
import { books, isValidId } from "./bookHelpers.js";

// Finds and returns one book by its MongoDB ID.
export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid book ID." });
    }

    const book = await books().findOne({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json(book);
  } catch (error) {
    console.error("Failed to get book:", error);
    res.status(500).json({ message: "Failed to load book details." });
  }
}
