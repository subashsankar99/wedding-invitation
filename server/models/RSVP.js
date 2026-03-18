const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  attending: {
    type: String,
    enum: ['Yes', 'No', 'Maybe'],
    required: [true, 'Please confirm attendance']
  },
  numberOfGuests: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  dietaryPreference: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Vegan', 'No Preference'],
    default: 'No Preference'
  }
}, { timestamps: true });

module.exports = mongoose.model('RSVP', rsvpSchema);