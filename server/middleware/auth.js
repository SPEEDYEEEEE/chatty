import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access denied.");
    }

    // Check if token starts with "Bearer "
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    } else {
      return res.status(400).send("Invalid token format. Use 'Bearer <token>'.");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the decoded user data to the request object

    // Debug log to verify the user ID
    console.log("Verified user:", req.user); // Check here if user contains the expected properties

    // Make sure req.userId is set based on the structure of the token
    req.userId = verified.id; // Ensure this matches the decoded token's user ID

    next();
  } catch (err) {
    console.error("Token verification error:", err); // Log the error for debugging
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(500).json({ error: err.message });
  }
};
