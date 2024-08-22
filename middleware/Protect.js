const jwt = require("jsonwebtoken");
const User = require("../schema/AuthSchema");

// Middleware to protect routes and retrieve token from cookies
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], // Explicitly specify the algorithm
    });

    // Fetch user and attach to req object
    req.user = await User.findById(decoded.id).select("-password -__v");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, not authorized" });
    } else {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
};

module.exports = { protect };
