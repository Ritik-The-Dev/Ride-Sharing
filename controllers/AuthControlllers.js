const User = require("../schema/AuthSchema");
const { generateToken } = require("../utlity/generateToken");
const { setTokenCookie } = require("../utlity/setCookie");

// Controller for user signup
const SignUp = async (req, res) => {
  const { username, email, password, number, role } = req.body;

  try {
    // Check if user already exists by email or number
    const userExists = await User.findOne({
      $or: [{ email }, { number }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Creating new user
    const user = new User({
      username,
      email,
      password,
      number,
      role,
    });

    // Save user with hashed password
    await user.save();

    // Generate token and store it in a cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Send success response with token and user data
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
      $or: [{ email }, { number }],
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
