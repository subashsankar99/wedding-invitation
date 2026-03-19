// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // local Vite dev
    'http://localhost:3000', // local CRA dev (if used)
    'https://subashsankar99.github.io', // replace with your actual GitHub Pages URL
    'https://subashsankar99.github.io/wedding-invitation'
  ],
  credentials: true,
}));

//app.use(cors({ origin: '*', credentials: true }));

app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ── Wish Schema & Routes ──
const wishSchema = new mongoose.Schema({
  guestName: { type: String, required: true, maxlength: 50 },
  message: { type: String, required: true, maxlength: 500 },
  relation: { type: String, default: 'Friend' },
  emoji: { type: String, default: '💝' },
}, { timestamps: true });

const Wish = mongoose.model('Wish', wishSchema);

app.get('/api/wishes', async (req, res) => {
  try {
    const wishes = await Wish.find().sort({ createdAt: -1 });
    res.status(200).json({ data: wishes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching wishes' });
  }
});

app.post('/api/wishes', async (req, res) => {
  try {
    const wish = await Wish.create(req.body);
    res.status(201).json({ data: wish });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Error creating wish' });
  }
});

// ── Query Schema & Routes ──
const querySchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  queryType: { type: String, default: 'Venue' },
  message: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);

app.post('/api/queries', async (req, res) => {
  try {
    const query = await Query.create(req.body);
    res.status(201).json({ data: query });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Error creating query' });
  }
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: '🎉 Wedding API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
