const express = require("express");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const HTTP = require("http");
const { connectDb } = require("./config/connectDb");
const { AuthRoutes } = require("./routes/AuthRoutes");
const { OtpRoutes } = require("./routes/OtpRoutes");

require("dotenv").config();

// Initialize Express app and HTTP server
const app = express();
const server = HTTP.createServer(app);

// Middleware to parse cookies
app.use(cookieParser());

// Database connection
connectDb();

// Middleware to parse JSON request bodies
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// PORT from environment variables
const PORT = process.env.PORT || 5000; // Provide a default port if not specified in .env

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Test route to check if the server is running
app.get("/", (req, res) => {
  res.json({ msg: "Server is running" });
});

// Auth routes
app.use("/api/auth", AuthRoutes); // AuthRoutes under '/api/auth' for clarity
app.use("/api/otp", OtpRoutes); // OtpRoutes under '/api/otp' for clarity

// Initializing Socket.IO
const io = socketIo(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

// Testing Socket events
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
