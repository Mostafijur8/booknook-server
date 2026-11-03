// Handles the endpoint for validating and updating a book.
import { ObjectId } from "mongodb";
import { books, isValidId } from "./bookHelpers.js";

// Updates allowed fields on an existing book.
export async function updateBook(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid book ID." });
    }

    const allowedFields = ["title", "author", "category", "image", "description", "totalCopies"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    for (const field of ["title", "author", "category"]) {
      if (field in updates) {
        if (typeof updates[field] !== "string" || !updates[field].trim()) {
          return res.status(400).json({ message: `${field} cannot be empty.` });
        }
        updates[field] = updates[field].trim();
      }
    }

    if (
      "totalCopies" in updates &&
      (!Number.isInteger(updates.totalCopies) || updates.totalCopies < 1)
    ) {
      return res.status(400).json({ message: "totalCopies must be at least 1." });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No changes were provided." });
    }

    updates.updatedAt = new Date();
    const result = await books().updateOne(
      { _id: new ObjectId(id) },
      { $set: updates },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Book not found." });
    }

    const updatedBook = await books().findOne({ _id: new ObjectId(id) });
    res.json(updatedBook);
  } catch (error) {
    console.error("Failed to update book:", error);
    res.status(500).json({ message: "Failed to update the book." });
  }
}
