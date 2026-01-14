const mongoose = require('mongoose');

// Cache for event data to avoid hammering external APIs
const eventCacheSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },

    coordinates: {
        lat: Number,
        lng: Number
    },

    searchRadius: {
        type: Number,
        default: 25 // km
    },

    dateRange: {
        start: Date,
        end: Date
    },

    // The actual event data
    events: [{
        eventId: String,
        name: String,
        description: String,
        category: String,
        date: Date,
        endDate: Date,
        location: {
            name: String,
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        url: String,
        isFree: Boolean,
        source: String, // 'eventbrite', 'predicthq', etc.
        imageUrl: String,
        relevanceScore: Number
    }],

    cachedAt: {
        type: Date,
        default: Date.now
    },

    // Cache expires after 24 hours
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

}, {
    timestamps: true
});

// Auto-delete expired caches
eventCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups
eventCacheSchema.index({
    location: 1,
    'dateRange.start': 1,
    'dateRange.end': 1
});

// Static method to find cached events
eventCacheSchema.statics.findCached = function (location, startDate, endDate) {
    return this.findOne({
        location: new RegExp(location, 'i'),
        'dateRange.start': { $lte: new Date(startDate) },
        'dateRange.end': { $gte: new Date(endDate) },
        expiresAt: { $gt: new Date() }
    });
};

module.exports = mongoose.model('EventCache', eventCacheSchema);
