const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const wishRoutes = require('./routes/wishRoutes');
const queryRoutes = require('./routes/queryRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/wishes', wishRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/rsvp', rsvpRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '💍 Wedding Invitation API is running!',
    endpoints: {
      wishes: '/api/wishes',
      queries: '/api/queries',
      rsvp: '/api/rsvp'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});