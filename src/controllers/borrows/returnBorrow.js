import { ObjectId } from "mongodb";
import { books, borrows, isValidId } from "./borrowHelpers.js";

// Returns a borrowed book and restores one available copy.
export async function returnBorrow(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid borrow ID." });
    }

    const borrowRecord = await borrows().findOne({
      _id: new ObjectId(id),
      userEmail: req.user.email,
    });

    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    const result = await borrows().deleteOne({
      _id: new ObjectId(id),
      userEmail: req.user.email,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    if (isValidId(borrowRecord.bookId)) {
      await books().updateOne(
        { _id: new ObjectId(borrowRecord.bookId) },
        { $inc: { totalCopies: 1 } },
      );
    }

    res.json({ message: "Book returned successfully." });
  } catch (error) {
    console.error("Failed to return book:", error);
    res.status(500).json({ message: "Failed to return the book." });
  }
}
