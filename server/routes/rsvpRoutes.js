const express = require('express');
const router = express.Router();
const {
  getAllRSVPs,
  createRSVP,
  updateRSVP
} = require('../controllers/rsvpController');

router.route('/')
  .get(getAllRSVPs)
  .post(createRSVP);

router.route('/:id')
  .put(updateRSVP);

module.exports = router;