const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = 5000;
const MONGODB_URI = 'mongodb+srv://pradhansushantakumar5:BfuMUj8RGy3xUv61@cluster0.emnouqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = 'your_secret_key_here'; // Change this to a secure key

const app = express();

// Middleware
app.use(cors());
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
