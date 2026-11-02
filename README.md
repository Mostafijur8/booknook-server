# BookNook Server

Backend for the BookNook online library project. The server uses Express.js and MongoDB, with JavaScript ES modules.

## Requirements

- Node.js
- MongoDB connection string
- Dependencies installed with `npm install`

## Configuration

Create a `.env` file in the project root and set `MONGODB_URI` to your MongoDB connection string. The server uses port `5000` by default; you can set `PORT` in `.env` to use another port.

Keep `.env` private and do not commit database credentials.

## Run the server

- Development: `npm run dev`
- Production: `npm start`

Both scripts start `src/index.js`. The server connects to MongoDB before listening for requests. The root endpoint is `GET /` and returns a BookNook welcome message.

## Project structure

```text
src/
├── index.js                 # Express app entry point
├── config/
│   └── db.js                # MongoDB connection and database access
├── middleware/
│   ├── verifyToken.js       # JWT verification middleware (currently empty)
│   └── verifyUser.js        # User authorization middleware (currently empty)
├── routes/
│   ├── bookRoutes.js        # Book endpoints (currently empty)
│   └── borrowRoutes.js      # Borrow endpoints (currently empty)
├── controllers/
│   ├── bookController.js    # Book CRUD handlers (currently empty)
│   └── borrowController.js # Borrow and return handlers (currently empty)
└── utils/
    └── generateToken.js     # JWT helper (currently empty)
```

## Planned API responsibilities

- `bookRoutes.js` maps book URLs and HTTP methods to handlers in `bookController.js`.
- `bookController.js` will implement creating, listing, reading, updating, and deleting books.
- `borrowRoutes.js` maps borrow and return endpoints to `borrowController.js`.
- `borrowController.js` will implement borrowing, listing a user's borrows, and returning books. Copy counts and duplicate-borrow checks belong here.
- `verifyToken.js` will validate JWTs for protected endpoints. `verifyUser.js` can enforce user-specific access rules.
- `db.js` provides the MongoDB connection; database operations should use the connected database.
- `generateToken.js` will contain the JWT creation helper if the backend needs to issue tokens.

## Current implementation status

The project currently has MongoDB connection setup and a root welcome endpoint. The book and borrow route, controller, and authentication files are present as placeholders; their APIs and JWT behavior have not been implemented yet.

## Deployment note

The current `vercel.json` points to the root `index.js`, while the application entry point is `src/index.js`. Update the Vercel configuration before deploying this structure.
