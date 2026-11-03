import { Router } from "express";
import { createBorrow } from "../controllers/borrows/createBorrow.js";
import { getBorrows } from "../controllers/borrows/getBorrows.js";
import { returnBorrow } from "../controllers/borrows/returnBorrow.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

// Requires a valid Better Auth token for every borrow endpoint.
router.use(verifyToken);

// Maps GET /borrows to the authenticated user's borrow list.
router.get("/", getBorrows);
// Maps POST /borrows to the borrow creation controller.
router.post("/", createBorrow);
// Maps DELETE /borrows/:id to the return controller.
router.delete("/:id", returnBorrow);

export default router;
