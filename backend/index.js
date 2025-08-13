const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;
const JWT_SECRET = process.env.JWT_SECRET ;

// Middleware
app.use(cors({
  origin: 'https://mern-musebook.vercel.app', // ✅ Replace with your Vercel frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

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

// Health Check
app.get('/', (req, res) => {
  res.send('Backend is working ✅');
});

// Register User
app.post('/register', async (req, res) => {
  const { fullName, fullemail, fullpassword } = req.body;

  try {
    const existingUser = await User.findOne({ fullemail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(fullpassword, 10);
    const user = new User({ fullName, fullemail, fullpassword: hashedPassword });

    await user.save();
    res.json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login User with JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ fullemail: email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.fullpassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, email: user.fullemail }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Razorpay payment order endpoint
app.post('/api/payOrder', async (req, res) => {
  const input = req.body;
  if (input.action !== 'payOrder') {
    return res.json({ res: 'error', info: 'Invalid request or missing action parameter.' });
  }

  const razorpay_mode = process.env.RAZORPAY_MODE || 'test';
  const razorpay_test_key = process.env.RAZORPAY_TEST_KEY;
  const razorpay_test_secret_key = process.env.RAZORPAY_TEST_SECRET;
  const razorpay_live_key = process.env.RAZORPAY_LIVE_KEY;
  const razorpay_live_secret_key = process.env.RAZORPAY_LIVE_SECRET;

  let razorpay_key, authAPIkey;
  if (razorpay_mode === 'test') {
    razorpay_key = razorpay_test_key;
    authAPIkey = "Basic " + Buffer.from(razorpay_test_key + ":" + razorpay_test_secret_key).toString('base64');
  } else {
    razorpay_key = razorpay_live_key;
    authAPIkey = "Basic " + Buffer.from(razorpay_live_key + ":" + razorpay_live_secret_key).toString('base64');
  }

  const order_id = Date.now().toString();
  const { billing_name, billing_mobile, billing_email, payAmount } = input;
  const note = `Payment of amount Rs. ${payAmount}`;

  const postdata = {
    amount: payAmount * 100,
    currency: "INR",
    receipt: note,
    notes: { notes_key_1: note, notes_key_2: "" }
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
      return res.json({
        res: 'success',
        order_number: order_id,
        userData: {
          amount: payAmount,
          description: `Pay bill of Rs. ${payAmount}`,
          rpay_order_id: orderRes.id,
          name: billing_name,
          email: billing_email,
          mobile: billing_mobile
        },
        razorpay_key
      });
    } else {
      return res.json({ res: 'error', order_id, info: 'Error with payment' });
    }
  } catch (err) {
    return res.json({ res: 'error', order_id, info: 'Error with payment', error: err.message });
  }
});

// Store booking after payment
app.post('/api/bookMuseum', async (req, res) => {
  try {
    const {
      name, email, phone, visit_date, museum,
      adults, children, total,
      razorpay_payment_id, razorpay_order_id, razorpay_signature
    } = req.body;

    if (!name || !email || !phone || !visit_date || !museum || !razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ message: 'Missing required booking/payment details.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(visit_date);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'Booking date must be today or a future date.' });
    }

    const maxTickets = 10;
    const bookedAgg = await MuseumBooking.aggregate([
      { $match: { visit_date, museum } },
      { $group: { _id: null, totalBooked: { $sum: { $add: ["$adults", "$children"] } } } }
    ]);
    const alreadyBooked = bookedAgg.length > 0 ? bookedAgg[0].totalBooked : 0;
    const requestedTickets = (adults || 0) + (children || 0);

    if (alreadyBooked + requestedTickets > maxTickets) {
      return res.status(400).json({
        message: `Booking exceeds daily limit. Only ${maxTickets - alreadyBooked} tickets left for ${museum} on ${visit_date}.`
      });
    }

    const booking = new MuseumBooking({
      name, email, phone, visit_date, museum, adults, children, total,
      razorpay_payment_id, razorpay_order_id, razorpay_signature
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

  const museums = [
    "National Museum",
    "Salar Jung Museum",
    "Victoria Memorial",
    "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    "Calico Museum of Textiles"
  ];
  const maxTickets = 10;

  try {
    const bookings = await MuseumBooking.aggregate([
      { $match: { visit_date } },
      { $group: { _id: "$museum", totalBooked: { $sum: { $add: ["$adults", "$children"] } } } }
    ]);

    const availability = {};
    museums.forEach(museum => {
      const booked = bookings.find(b => b._id === museum);
      availability[museum] = Math.max(maxTickets - (booked ? booked.totalBooked : 0), 0);
    });

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching availability.', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
