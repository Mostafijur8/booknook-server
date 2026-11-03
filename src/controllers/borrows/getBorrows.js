import { borrows } from "./borrowHelpers.js";

// Returns only the authenticated user's borrow records.
export async function getBorrows(req, res) {
  try {
    const result = await borrows()
      .find({ userEmail: req.user.email })
      .sort({ borrowDate: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    console.error("Failed to get borrows:", error);
    res.status(500).json({ message: "Failed to load borrowed books." });
  }
}
