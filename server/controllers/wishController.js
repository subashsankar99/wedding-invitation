const Wish = require('../models/Wish');

// GET all approved wishes
exports.getAllWishes = async (req, res) => {
  try {
    const wishes = await Wish.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: wishes.length,
      data: wishes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wishes',
      error: error.message
    });
  }
};

// POST create a new wish
exports.createWish = async (req, res) => {
  try {
    const { guestName, message, relation, emoji } = req.body;

    const wish = await Wish.create({
      guestName,
      message,
      relation,
      emoji
    });

    res.status(201).json({
      success: true,
      message: 'Wish added successfully! 💝',
      data: wish
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not add wish',
      error: error.message
    });
  }
};

// DELETE a wish
exports.deleteWish = async (req, res) => {
  try {
    const wish = await Wish.findByIdAndDelete(req.params.id);
    if (!wish) {
      return res.status(404).json({
        success: false,
        message: 'Wish not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Wish removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};