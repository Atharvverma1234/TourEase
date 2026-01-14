// Controller for weather forecast endpoints
const weatherService = require('../services/weatherService');

// Get weather forecast for trip dates
exports.getWeatherForecast = async (req, res) => {
    try {
        const { location, startDate, endDate } = req.query;

        if (!location || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: location, startDate'
            });
        }

        const dates = {
            start: startDate,
            end: endDate || startDate
        };

        const forecast = await weatherService.getWeatherForecast(location, dates);

        res.json({
            success: true,
            location,
            forecast
        });

    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather forecast',
            error: error.message
        });
    }
};

// Get weather disruptions
exports.getDisruptions = async (req, res) => {
    try {
        const { location, startDate, endDate } = req.query;

        if (!location || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        const dates = {
            start: startDate,
            end: endDate || startDate
        };

        const forecast = await weatherService.getWeatherForecast(location, dates);
        const disruptions = weatherService.detectWeatherDisruptions(forecast);

        res.json({
            success: true,
            location,
            disruptionsCount: disruptions.length,
            disruptions
        });

    } catch (error) {
        console.error('Error fetching weather disruptions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather disruptions',
            error: error.message
        });
    }
};
