const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 50
  },
  message: {
    type: String,
    required: [true, 'Wish message is required'],
    trim: true,
    maxlength: 500
  },
  relation: {
    type: String,
    enum: ['Family', 'Friend', 'Colleague', 'Other'],
    default: 'Friend'
  },
  emoji: {
    type: String,
    default: '💝'
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Wish', wishSchema);