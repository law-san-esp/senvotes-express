const express = require('express');
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/vote', authMiddleware, voteController.vote);
router.get('/list', voteController.listVotes);

module.exports = router;
