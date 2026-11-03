import { Router } from "express";
import { createBook } from "../controllers/books/createBook.js";
import { deleteBook } from "../controllers/books/deleteBook.js";
import { getBookById } from "../controllers/books/getBookById.js";
import { getBooks } from "../controllers/books/getBooks.js";
import { updateBook } from "../controllers/books/updateBook.js";

const router = Router();

// Maps GET /books to the book listing and search controller.
router.get("/", getBooks);
// Maps GET /books/:id to the single-book controller.
router.get("/:id", getBookById);
// Maps POST /books to the create-book controller.
router.post("/", createBook);
// Maps PATCH /books/:id to the update-book controller.
router.patch("/:id", updateBook);
// Maps DELETE /books/:id to the delete-book controller.
router.delete("/:id", deleteBook);

export default router;
