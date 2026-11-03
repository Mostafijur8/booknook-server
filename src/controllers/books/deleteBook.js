// Handles the endpoint for deleting a book by ID.
import { ObjectId } from "mongodb";
import { books, isValidId } from "./bookHelpers.js";

// Deletes one book from MongoDB by its ID.
export async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid book ID." });
    }

    const result = await books().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Failed to delete book:", error);
    res.status(500).json({ message: "Failed to delete the book." });
  }
}
