const Query = require('../models/Query');

// GET all queries
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// POST create a query
exports.createQuery = async (req, res) => {
  try {
    const query = await Query.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Query submitted! We will get back to you soon. 📩',
      data: query
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not submit query',
      error: error.message
    });
  }
};

// PUT reply to a query (admin use)
exports.replyToQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        reply: req.body.reply,
        status: 'Answered'
      },
      { new: true, runValidators: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reply sent!',
      data: query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};