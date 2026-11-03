// Handles the endpoint for validating and creating a book.
import { books } from "./bookHelpers.js";

// Validates the submitted fields and creates a new book in MongoDB.
export async function createBook(req, res) {
  try {
    const { title, author, category, image, description, addedBy, totalCopies } = req.body;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !category?.trim() ||
      !Number.isInteger(totalCopies) ||
      totalCopies < 1
    ) {
      return res.status(400).json({
        message: "Title, author, category, and a valid totalCopies are required.",
      });
    }

    const ownerName =
      typeof addedBy?.name === "string" && addedBy.name.trim()
        ? addedBy.name.trim()
        : req.user.email;
    const now = new Date();
    const newBook = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      image: typeof image === "string" ? image.trim() : "",
      description: typeof description === "string" ? description.trim() : "",
      addedBy: { name: ownerName, email: req.user.email },
      totalCopies,
      createdAt: now,
      updatedAt: now,
    };

    const result = await books().insertOne(newBook);
    res.status(201).json({ ...newBook, _id: result.insertedId });
  } catch (error) {
    console.error("Failed to create book:", error);
    res.status(500).json({ message: "Failed to add the book." });
  }
}
