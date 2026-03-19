// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow your GitHub Pages domain
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://yourusername.github.io'  // ← Replace with YOUR GitHub Pages URL
  ],
  credentials: true
}));

app.use(express.json());

// ✅ Connect to MongoDB Atlas (cloud) instead of localhost
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ── Wish Schema & Routes ──
const wishSchema = new mongoose.Schema({
  guestName: { type: String, required: true, maxlength: 50 },
  message: { type: String, required: true, maxlength: 500 },
  relation: { type: String, default: 'Friend' },
  emoji: { type: String, default: '💝' }
}, { timestamps: true });

const Wish = mongoose.model('Wish', wishSchema);

app.get('/api/wishes', async (req, res) => {
  try {
    const wishes = await Wish.find().sort({ createdAt: -1 });
    res.json({ data: wishes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/wishes', async (req, res) => {
  try {
    const wish = await Wish.create(req.body);
    res.status(201).json({ data: wish });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── Query Schema & Routes ──
const querySchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  queryType: { type: String, default: 'Venue' },
  message: { type: String, required: true, maxlength: 1000 }
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);

app.post('/api/queries', async (req, res) => {
  try {
    const query = await Query.create(req.body);
    res.status(201).json({ data: query });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: '🎉 Wedding API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
