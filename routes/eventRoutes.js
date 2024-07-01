const express = require('express');
const eventController = require('../controllers/eventController');
const middlewares = require('../middlewares/middlewares');
const router = express.Router();

router.post('/create', middlewares.adminMiddleware, eventController.createEvent);
router.post('/update', middlewares.adminMiddleware, eventController.updateEvent);
router.post('/delete', middlewares.adminMiddleware, eventController.deleteEvent);
router.get('/list', middlewares.authMiddleware, eventController.listEvents);
router.get('/:id', middlewares.authMiddleware, eventController.findEventById);

module.exports = router;
