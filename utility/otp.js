const twilio = require("twilio");
const nodemailer = require("nodemailer");
require("dotenv").config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const sendOtp = async (phoneNumber, otp) => {
  phoneNumber = phoneNumber.toString();
  if (!phoneNumber.startsWith("+")) {
    phoneNumber = "+91" + phoneNumber; // Assuming +91 for India, adjust accordingly
  }
  try {
    await client.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
};

// Function to send OTP via Email
const sendEmailOtp = async (email, otp, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any email service you use
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Ride Sharing</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>${body}</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Ride Sharing</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Ride Sharing Inc</p>
      <p>160 Mumbai East</p>
      <p>India</p>
    </div>
  </div>
</div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP via email");
  }
};

module.exports = { generateOtp, sendOtp, sendEmailOtp };
