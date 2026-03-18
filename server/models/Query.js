const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  queryType: {
    type: String,
    enum: ['Venue', 'Accommodation', 'Dress Code', 'Food', 'Travel', 'Other'],
    required: [true, 'Please select a query type']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 1000
  },
  reply: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Answered'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);