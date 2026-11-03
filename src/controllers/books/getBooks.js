// Handles the endpoint for listing and searching books.
import { escapeRegex, books } from "./bookHelpers.js";

// Returns all books with optional category filtering and title/author search.
export async function getBooks(req, res) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = category;

    if (search) {
      const searchPattern = new RegExp(escapeRegex(String(search)), "i");
      filter.$or = [{ title: searchPattern }, { author: searchPattern }];
    }

    const result = await books().find(filter).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    console.error("Failed to get books:", error);
    res.status(500).json({ message: "Failed to load books." });
  }
}
