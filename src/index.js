import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

const app = express();

// Allows browser requests only from the configured frontend origins.
const defaultClientOrigins = [
  "http://localhost:3000",
  "https://booknook-tawny.vercel.app",
];
const clientOrigins = new Set(
  [
    ...defaultClientOrigins,
    ...(process.env.CLIENT_ORIGINS || "").split(","),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean),
);

// Handles CORS headers and preflight requests for local and deployed clients.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowedOrigin = origin && clientOrigins.has(origin);

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(!origin || isAllowedOrigin ? 204 : 403);
  }

  next();
});

app.use(express.json());

// Mounts book endpoints at /books.
app.use("/books", bookRoutes);
// Mounts authenticated borrowing endpoints at /borrows.
app.use("/borrows", borrowRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to BookNook Server!");
});

await connectDB();

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`BookNook server running on port ${port}`);
  });
}

export default app;
