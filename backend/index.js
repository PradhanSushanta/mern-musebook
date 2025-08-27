const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;


// Middleware
app.use(cors({
  origin: 'https://mern-musebook.vercel.app', // ✅ Replace with your Vercel frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', (err) => console.log('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connected'));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  fullemail: String,
  fullpassword: String,
});

const User = mongoose.model('User', userSchema);

// Museum Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  visit_date: String,
  museum: String,
  adults: Number,
  children: Number,
  total: Number,
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
  createdAt: { type: Date, default: Date.now }
});

const MuseumBooking = mongoose.model('MuseumBooking', bookingSchema);

// Example OTP Mongo Schema
const OtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires in 5 min
});
const Otp = mongoose.model('Otp', OtpSchema);

// To set
await Otp.create({ email, otp });
// To get & check
const record = await Otp.findOne({ email, otp });
if (!record) return res.json({ success: false, message: "Invalid OTP." });
await record.deleteOne(); // Remove after use


// Setup nodemailer transporter (use your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "sushantapradhankumar67@gmail.com", // your gmail address
    pass: "camw dvaf byfg kibc"  // your gmail app password
  }
});

// Log nodemailer config (do NOT log password)
console.log("Nodemailer config EMAIL_USER:", "sushantapradhankumar67@gmail.com");

// Verify transporter on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error("Nodemailer transporter verification failed:", error);
  } else {
    console.log("Nodemailer transporter is ready to send emails");
  }
});

// Register User
app.post('/register', async (req, res) => {
  const { fullName, fullemail, fullpassword } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ fullemail });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(fullpassword, 10);
  const user = new User({ fullName, fullemail, fullpassword: hashedPassword });

  await user.save();
  res.json({ message: 'User created successfully' });
});

// Login User with JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Received login request:", email, password); // ✅ Debugging

  // Check if user exists (match `email` to `fullemail` in DB)
  const user = await User.findOne({ fullemail: email });
  if (!user) {
    console.log("User not found");
    return res.status(400).json({ message: 'User not found' });
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.fullpassword);
  if (!isMatch) {
    console.log("Invalid password");
    return res.status(400).json({ message: 'Invalid password' });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user._id, email: user.fullemail }, JWT_SECRET, { expiresIn: '1h' });

  console.log("Login successful, token generated:", token);
  res.json({ message: 'Login successful', token });
});

// Razorpay payment order endpoint
app.post('/api/payOrder', async (req, res) => {
  const input = req.body;
  if (input.action !== 'payOrder') {
    return res.json({ res: 'error', info: 'Invalid request or missing action parameter.' });
  }

  // Razorpay test credentials
  const razorpay_mode = 'test';
  const razorpay_test_key = 'rzp_test_bRz1jQuw4K1bue';
  const razorpay_test_secret_key = '0YjwdDbh9l93hYVjtMFIBWrt';
  const razorpay_live_key = 'Your_Live_Key';
  const razorpay_live_secret_key = 'Your_Live_Secret_Key';

  let razorpay_key, authAPIkey;
  if (razorpay_mode === 'test') {
    razorpay_key = razorpay_test_key;
    authAPIkey = "Basic " + Buffer.from(razorpay_test_key + ":" + razorpay_test_secret_key).toString('base64');
  } else {
    razorpay_key = razorpay_live_key;
    authAPIkey = "Basic " + Buffer.from(razorpay_live_key + ":" + razorpay_live_secret_key).toString('base64');
  }

  // Set transaction details
  const order_id = Date.now().toString();
  const billing_name = input.billing_name;
  const billing_mobile = input.billing_mobile;
  const billing_email = input.billing_email;
  const payAmount = input.payAmount;

  const note = "Payment of amount Rs. " + payAmount;

  const postdata = {
    amount: payAmount * 100,
    currency: "INR",
    receipt: note,
    notes: {
      notes_key_1: note,
      notes_key_2: ""
    }
  };

  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      postdata,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authAPIkey
        }
      }
    );
    const orderRes = response.data;
    if (orderRes.id) {
      const rpay_order_id = orderRes.id;
      const dataArr = {
        amount: payAmount,
        description: "Pay bill of Rs. " + payAmount,
        rpay_order_id: rpay_order_id,
        name: billing_name,
        email: billing_email,
        mobile: billing_mobile
      };
      return res.json({
        res: 'success',
        order_number: order_id,
        userData: dataArr,
        razorpay_key: razorpay_key
      });
    } else {
      return res.json({ res: 'error', order_id: order_id, info: 'Error with payment' });
    }
  } catch (err) {
    return res.json({ res: 'error', order_id: order_id, info: 'Error with payment', error: err.message });
  }
});

// Store booking after payment
app.post('/api/bookMuseum', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      visit_date,
      museum,
      adults,
      children,
      total,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !visit_date || !museum || !razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ message: 'Missing required booking/payment details.' });
    }

    // Date validation: only today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(visit_date);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'Booking date must be today or a future date.' });
    }

    // Enforce per-day ticket limit
    const maxTickets = 10;
    const bookedAgg = await MuseumBooking.aggregate([
      { $match: { visit_date, museum } },
      {
        $group: {
          _id: null,
          totalBooked: { $sum: { $add: ["$adults", "$children"] } }
        }
      }
    ]);
    const alreadyBooked = bookedAgg.length > 0 ? bookedAgg[0].totalBooked : 0;
    const requestedTickets = (adults || 0) + (children || 0);

    if (alreadyBooked + requestedTickets > maxTickets) {
      return res.status(400).json({
        message: `Booking exceeds daily limit. Only ${maxTickets - alreadyBooked} tickets left for ${museum} on ${visit_date}.`
      });
    }

    const booking = new MuseumBooking({
      name,
      email,
      phone,
      visit_date,
      museum,
      adults,
      children,
      total,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    });

    await booking.save();
    res.json({ message: 'Booking stored successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error storing booking.', error: err.message });
  }
});

// Museum ticket availability endpoint
app.get('/api/availability', async (req, res) => {
  const { visit_date } = req.query;
  if (!visit_date) {
    return res.status(400).json({ message: 'visit_date query parameter is required.' });
  }

  // List of museums and max tickets per museum
  const museums = [
    "National Museum",
    "Salar Jung Museum",
    "Victoria Memorial",
    "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    "Calico Museum of Textiles"
  ];
  const maxTickets = 10;

  // Aggregate bookings for the given date
  try {
    const bookings = await MuseumBooking.aggregate([
      { $match: { visit_date } },
      {
        $group: {
          _id: "$museum",
          totalBooked: { $sum: { $add: ["$adults", "$children"] } }
        }
      }
    ]);

    // Build availability map
    const availability = {};
    museums.forEach(museum => {
      const booked = bookings.find(b => b._id === museum);
      const available = maxTickets - (booked ? booked.totalBooked : 0);
      availability[museum] = available > 0 ? available : 0;
    });

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching availability.', error: err.message });
  }
});

// Send OTP to email
app.post('/forgot-password/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ fullemail: email });
  if (!user) {
    return res.json({ success: false, message: "Email not registered." });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  // Send email
  try {
    await transporter.sendMail({
      from: "sushantapradhankumar67@gmail.com",
      to: email,
      subject: "MuseBook Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`
    });
    res.json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    console.error("Nodemailer error:", err); // Log full error object
    res.json({ success: false, message: "Failed to send OTP.", error: err });
  }
});

// Reset password
app.post('/forgot-password/reset', async (req, res) => {
  const { email, newPassword, otp } = req.body;
  const user = await User.findOne({ fullemail: email });
  if (!user) {
    return res.json({ success: false, message: "Email not registered." });
  }
  if (otpStore[email] !== otp) {
    return res.json({ success: false, message: "Invalid OTP." });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.fullpassword = hashedPassword;
  await user.save();
  delete otpStore[email];
  res.json({ success: true, message: "Password reset successful." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
