const express = require("express");
const AuthControllers = require("../controllers/AuthControlllers");
const AuthRoutes = express.Router();

// Routes for user authentication
AuthRoutes.post("/signup", AuthControllers.SignUp);
AuthRoutes.post("/login", AuthControllers.Login);

module.exports = { AuthRoutes };
