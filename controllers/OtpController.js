const User = require("../schema/AuthSchema");
const Otp = require("../schema/OtpSchema");
const { generateOtp, sendOtp, sendEmailOtp } = require("../utility/otp");

// Controller for sending OTP during Signup
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

    // Check if OTP is already sent
    const previousOtp = await Otp.findOne({ number });
    if (previousOtp) {
      return res.status(400).json({
        message: "Please wait for 5mins before requesting a new OTP.",
      });
    }

    // Generate and send OTP
    const otpCode = generateOtp();
    await sendOtp(number, otpCode);
    await Otp.create({ otp: otpCode, number });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller for sending OTP during Password Recovery
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
    await sendOtp(number, otpCode);
    await Otp.create({ otp: otpCode, number });

    res
      .status(200)
      .json({ message: "OTP sent successfully for password recovery" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller for sending OTP via Email
const SendEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (!userExists) {
      return res
        .status(400)
        .json({ message: "User not found with this email" });
    }

    // Check if OTP is already sent
    const previousOtp = await Otp.findOne({ email: email.toLowerCase() });
    if (previousOtp) {
      return res
        .status(400)
        .json({ message: "Please wait before requesting a new OTP." });
    }

    // Generate and send OTP
    const otpCode = generateOtp();
    const EmailTemplate = {
      subject: "Email Verification for Ride Sharing 👀",
      body: "Thank you for choosing Ride Sharing. Use the following OTP to complete your Email Verfication procedures. OTP is valid for 5 minutes",
    };
    await sendEmailOtp(
      email.toLowerCase(),
      otpCode,
      EmailTemplate.subject,
      EmailTemplate.body
    );
    await Otp.create({ otp: otpCode, email });

    res
      .status(200)
      .json({ message: "OTP sent successfully for email verification" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { SignUpOtp, ForgetPassOtp, SendEmailOtp };
