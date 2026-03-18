const express = require('express');
const router = express.Router();
const {
  getAllQueries,
  createQuery,
  replyToQuery
} = require('../controllers/queryController');

router.route('/')
  .get(getAllQueries)
  .post(createQuery);

router.route('/:id')
  .put(replyToQuery);

module.exports = router;