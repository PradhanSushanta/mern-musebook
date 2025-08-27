const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// ...existing code...

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'MuseBook Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // ...save OTP to DB or cache if needed...
    res.json({ success: true, otp }); // Remove otp from response in production!
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please check your email and try again.' });
  }
});

// ...existing code...

module.exports = router;