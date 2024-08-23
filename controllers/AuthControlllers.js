const User = require("../schema/AuthSchema");
const { generateToken } = require("../utility/generateToken");
const { setTokenCookie } = require("../utility/setCookie");
const Otp = require("../schema/OtpSchema");

// Controller for user signup
const SignUp = async (req, res) => {
  const { username, email, password, number, role, otp } = req.body;

  try {
    // Check for missing fields
    if (!username || !email || !password || !number || !role || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email and number format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(email) || !phoneRegex.test(number)) {
      return res.status(400).json({ message: "Invalid email or phone format" });
    }

    // Check if user already exists by email or number
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { number }],
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate OTP
    const otpData = await Otp.findOne({ number });
    if (!otpData || otpData.otp !== otp) {
      return res.status(402).json({ message: "Invalid or incorrect OTP" });
    }

    // Create new user
    const user = new User({ username, email, password, number, role });
    await user.save();

    // Generate token and store in a cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Send success response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      number: user.number,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller for user login
const Login = async (req, res) => {
  const { email, number, password } = req.body;

  try {
    // Check if user exists and select password field
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { number }],
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/number or password" });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email/number or password" });
    }

    // Generate token and store it in a cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Send success response with token and user data
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      number: user.number,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { SignUp, Login };
