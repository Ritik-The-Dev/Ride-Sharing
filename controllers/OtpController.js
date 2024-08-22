const User = require("../schema/AuthSchema");
const { generateOtp, sendOtp } = require("../utility/otp");
const nodemailer = require("nodemailer");
let otpStorage = {};

const SignUpOtp = async (req, res) => {
  const { number } = req.body;

  try {
    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ number });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this phone number" });
    }

    // Generate and send OTP
    const otpCode = generateOtp();
    otpStorage[number] = {
      otp: otpCode,
      expiresAt: Date.now() + process.env.OTP_EXPIRATION_TIME * 60 * 1000, // Expiry time in milliseconds
    };

    await sendOtp(number, otpCode);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const ForgetPassOtp = async (req, res) => {
  const { number } = req.body;

  try {
    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if user exists
    const userExists = await User.findOne({ number });
    if (!userExists) {
      return res
        .status(400)
        .json({ message: "User not found with this phone number" });
    }

    // Generate and send OTP
    const otpCode = generateOtp();
    otpStorage[number] = {
      otp: otpCode,
      expiresAt: Date.now() + process.env.OTP_EXPIRATION_TIME * 60 * 1000, // Expiry time in milliseconds
    };

    await sendOtp(number, otpCode);

    res
      .status(200)
      .json({ message: "OTP sent successfully for password recovery" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const SendEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res
        .status(400)
        .json({ message: "User not found with this email" });
    }

    // Generate OTP and set expiration
    const otpCode = generateOtp();
    otpStorage[email] = {
      otp: otpCode,
      expiresAt: Date.now() + process.env.OTP_EXPIRATION_TIME * 60 * 1000, // Expiry time in milliseconds
    };

    // Create transport for sending email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or any email service you use
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}`, // Use otpCode variable
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "OTP sent successfully for email verification" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { SignUpOtp, ForgetPassOtp, SendEmailOtp };
