const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Routes for event discovery
router.get('/nearby', eventController.getNearbyEvents);
router.get('/category/:type', eventController.getEventsByCategory);
router.get('/:id', eventController.getEventDetails);

module.exports = router;
