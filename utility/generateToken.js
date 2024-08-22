const jwt = require("jsonwebtoken");

// Utility function to generate JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
    algorithm: "HS256", // Algorithm
  });
};

module.exports = { generateToken };
