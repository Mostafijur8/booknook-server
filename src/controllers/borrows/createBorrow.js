import { ObjectId } from "mongodb";
import { books, borrows, isValidId } from "./borrowHelpers.js";

// Checks availability and creates a borrow record for the authenticated user.
export async function createBorrow(req, res) {
  let reservedBookId;

  try {
    const { bookId, returnDate } = req.body;

    if (!isValidId(bookId)) {
      return res.status(400).json({ message: "Invalid book ID." });
    }

    const parsedReturnDate = new Date(returnDate);
    if (!returnDate || Number.isNaN(parsedReturnDate.getTime()) || parsedReturnDate <= new Date()) {
      return res.status(400).json({ message: "Return date must be in the future." });
    }

    const bookObjectId = new ObjectId(bookId);
    const book = await books().findOne({ _id: bookObjectId });
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const userEmail = req.user.email;
    const existingBorrow = await borrows().findOne({ bookId, userEmail });
    if (existingBorrow) {
      return res.status(409).json({ message: "You have already borrowed this book." });
    }

    const reservation = await books().updateOne(
      { _id: bookObjectId, totalCopies: { $gt: 0 } },
      { $inc: { totalCopies: -1 } },
    );

    if (reservation.modifiedCount === 0) {
      return res.status(409).json({ message: "No copies of this book are available." });
    }
    reservedBookId = bookObjectId;

    const borrowRecord = {
      bookId: String(book._id),
      bookTitle: book.title,
      bookImage: book.image || "",
      userEmail,
      borrowDate: new Date(),
      returnDate: parsedReturnDate,
    };

    const result = await borrows().insertOne(borrowRecord);
    res.status(201).json({ ...borrowRecord, _id: result.insertedId });
  } catch (error) {
    if (reservedBookId) {
      try {
        await books().updateOne(
          { _id: reservedBookId },
          { $inc: { totalCopies: 1 } },
        );
      } catch (rollbackError) {
        console.error("Failed to restore the book copy:", rollbackError);
      }
    }

    console.error("Failed to create borrow:", error);
    res.status(500).json({ message: "Failed to borrow the book." });
  }
}
