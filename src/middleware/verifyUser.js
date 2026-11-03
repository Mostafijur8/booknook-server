import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Allows only the authenticated owner to update or delete a book.
export async function verifyUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id) || String(new ObjectId(id)) !== id) {
      return res.status(400).json({ message: "Invalid book ID." });
    }

    const book = await getDB()
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const ownerEmail = book.addedBy?.email;
    if (
      typeof ownerEmail !== "string" ||
      ownerEmail.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({ message: "You do not own this book." });
    }

    req.book = book;
    next();
  } catch (error) {
    console.error("Failed to verify book ownership:", error);
    res.status(500).json({ message: "Failed to verify book ownership." });
  }
}
