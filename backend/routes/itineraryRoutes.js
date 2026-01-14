const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// Routes for itinerary management
router.post('/save', itineraryController.saveItinerary);
router.post('/analyze', itineraryController.analyzeItinerary);
router.get('/user', itineraryController.getUserItineraries);
router.get('/:id', itineraryController.getItinerary);
router.get('/:id/suggestions', itineraryController.getSuggestions);
router.patch('/:id/apply', itineraryController.applySuggestion);
router.patch('/:id/reject', itineraryController.rejectSuggestion);

module.exports = router;
