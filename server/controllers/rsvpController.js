const RSVP = require('../models/RSVP');

// GET all RSVPs
exports.getAllRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: rsvps.length,
      data: rsvps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// POST create RSVP
exports.createRSVP = async (req, res) => {
  try {
    // Check if email already submitted
    const existing = await RSVP.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted your RSVP!'
      });
    }

    const rsvp = await RSVP.create(req.body);
    res.status(201).json({
      success: true,
      message: 'RSVP submitted! See you at the wedding! 🎉',
      data: rsvp
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not submit RSVP',
      error: error.message
    });
  }
};

// PUT update RSVP
exports.updateRSVP = async (req, res) => {
  try {
    const rsvp = await RSVP.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found'
      });
    }
    res.status(200).json({
      success: true,
      data: rsvp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};