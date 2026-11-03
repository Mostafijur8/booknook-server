# BookNook Server

Express and MongoDB API for the BookNook client. The frontend uses Better Auth and sends a signed JWT with protected API requests.

## Requirements

- Node.js
- MongoDB connection string
- Dependencies installed with `npm install`

## Local configuration

Create `.env` in this folder. Keep the MongoDB connection string private.

```env
PORT=5000
MONGODB_URI=<MongoDB connection string>
MONGODB_DATABASE=booknook
BETTER_AUTH_URL=http://localhost:3000
CLIENT_ORIGINS=http://localhost:3000
```

`MONGODB_DATABASE` defaults to `booknook` and should match the database used by the frontend Better Auth configuration. The server stores its collections there too. For production, configure `MONGODB_URI` to the same MongoDB cluster used locally and by the frontend; the database defaults to `booknook`. Set `BETTER_AUTH_URL` to the deployed frontend origin and `CLIENT_ORIGINS` to the allowed frontend origin when needed.

## Run locally

```bash
npm install
npm run dev
```

The server listens on port `5000` by default. Its root endpoint is `GET /`.

## API routes

### Books

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/books` | Public | List books; optional `category` and `search` query parameters |
| `GET` | `/books/:id` | Public | Get one book |
| `POST` | `/books` | JWT required | Add a book; the authenticated user becomes its owner |
| `PATCH` | `/books/:id` | Owner JWT required | Update a book |
| `DELETE` | `/books/:id` | Owner JWT required | Delete a book |

Book categories are `Fiction`, `Science`, `History`, `Kids`, and `Others`.

### Borrows

All borrow routes require a valid Better Auth JWT in the `Authorization: Bearer <token>` header.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/borrows` | List the authenticated user's borrow records |
| `POST` | `/borrows` | Borrow an available book; request body includes `bookId` and `returnDate` |
| `DELETE` | `/borrows/:id` | Return a borrow record owned by the authenticated user |

Borrowing reduces the available `totalCopies`; returning restores one copy. The server derives the user's email from the verified JWT and enforces one active borrow per user/book with a unique MongoDB index.

## Authentication and CORS

`verifyToken.js` verifies JWTs against the Better Auth JWKS endpoint at `/api/auth/jwks`. `verifyUser.js` checks book ownership before updates and deletes. Better Auth issues the JWTs, so the API does not create its own tokens. Local auth uses `BETTER_AUTH_URL`; Vercel deployments use the canonical frontend origin `https://booknook-tawny.vercel.app` for JWT issuer, audience, and JWKS. CORS permits the configured `CLIENT_ORIGINS`; local and deployed BookNook origins are included as defaults.

## Deployment

`vercel.json` routes requests to `src/index.js`. Configure `MONGODB_URI`, `MONGODB_DATABASE`, and any production auth/CORS environment variables in the deployment settings. Do not commit `.env` or credentials.
