const express = require('express');
const router = express.Router();
const {
  getAllWishes,
  createWish,
  deleteWish
} = require('../controllers/wishController');

router.route('/')
  .get(getAllWishes)
  .post(createWish);

router.route('/:id')
  .delete(deleteWish);

module.exports = router;