const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.header("Authorization");

    // Check if token exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied"
      });
    }

    // Support both formats:
    // 1. "Bearer TOKEN"
    // 2. "TOKEN"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    // Proceed to next middleware/route
    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};

module.exports = authMiddleware;