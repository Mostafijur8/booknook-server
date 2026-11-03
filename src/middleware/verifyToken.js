import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks;

// Uses the local auth server in development and the deployed frontend in production.
function getAuthURL() {
  return (
    process.env.BETTER_AUTH_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL
      ? "https://booknook-tawny.vercel.app"
      : "http://localhost:3000")
  );
}

// Returns the Better Auth public signing keys.
function getJwks() {
  const authURL = getAuthURL();

  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${authURL}/api/auth/jwks`));
  }

  return jwks;
}

// Verifies the Better Auth JWT and attaches the user's email to the request.
export async function verifyToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required." });
  }

  try {
    const authURL = getAuthURL();

    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: authURL,
      audience: authURL,
    });

    if (typeof payload.email !== "string") {
      return res.status(401).json({ message: "Invalid authentication token." });
    }

    req.user = { email: payload.email };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
