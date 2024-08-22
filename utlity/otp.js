const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const sendOtp = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
};

module.exports = { generateOtp, sendOtp };
