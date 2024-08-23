const mongoose = require("mongoose");

// Function to calculate OTP expiration time (5 minutes from now)
const expireTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

// OTP Schema Definition
const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true, // OTP is mandatory
    validate: {
      validator: function (v) {
        return /^[0-9]{6}$/.test(v); // OTP should be a 6-digit number
      },
      message: (props) => `${props.value} is not a valid OTP!`,
    },
  },
  email: {
    type: String,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Validates a 10-digit phone number
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  expire: {
    type: Date,
    default: expireTime, // Set default expiration time
    expires: 300, // Document will be automatically removed after 5 minutes
  },
});

// Export the OTP model
module.exports = mongoose.model("Otp", otpSchema);
