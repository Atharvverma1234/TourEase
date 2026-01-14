const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Routes for weather information
router.get('/forecast', weatherController.getWeatherForecast);
router.get('/disruptions', weatherController.getDisruptions);

module.exports = router;
