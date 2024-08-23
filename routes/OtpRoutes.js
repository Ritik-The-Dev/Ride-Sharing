const express = require("express");
const OtpControllers = require("../controllers/OtpController");
const OtpRoutes = express.Router();

// Routes for user authentication
OtpRoutes.post("/send-signup-otp", OtpControllers.SignUpOtp);
OtpRoutes.post("/send-forget-otp", OtpControllers.ForgetPassOtp);
OtpRoutes.post("/send-email-otp", OtpControllers.SendEmailOtp);

module.exports = { OtpRoutes };
