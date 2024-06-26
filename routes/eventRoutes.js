const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, eventController.createEvent);
router.get('/list', authMiddleware, eventController.listEvents);

module.exports = router;
