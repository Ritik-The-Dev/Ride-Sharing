const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the Auth schema
const AuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [4, "Username must be at least 4 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false, // Prevents the password from being returned in queries by default
  },
  number: {
    type: String, // Store number as string to accommodate leading zeros
    unique: true,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Validates a 10-digit phone number
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["user", "rider", "admin"], // Limits role to 'user', 'rider', or 'admin'
    default: "user",
  },
  EmailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password encryption before saving the document
AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
AuthSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", AuthSchema);
