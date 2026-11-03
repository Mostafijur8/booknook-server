import { Router } from "express";
import { createBook } from "../controllers/books/createBook.js";
import { deleteBook } from "../controllers/books/deleteBook.js";
import { getBookById } from "../controllers/books/getBookById.js";
import { getBooks } from "../controllers/books/getBooks.js";
import { updateBook } from "../controllers/books/updateBook.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

// Maps GET /books to the book listing and search controller.
router.get("/", getBooks);
// Maps GET /books/:id to the single-book controller.
router.get("/:id", getBookById);
// Requires authentication before creating a book.
router.post("/", verifyToken, createBook);
// Requires authentication before updating a book.
router.patch("/:id", verifyToken, updateBook);
// Requires authentication before deleting a book.
router.delete("/:id", verifyToken, deleteBook);

export default router;
