const mongoose = require('mongoose');

// Model for tracking adjustment suggestions made to itineraries
const suggestionSchema = new mongoose.Schema({
    itineraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary',
        required: true
    },

    day: {
        type: Number,
        required: true
    },

    suggestionType: {
        type: String,
        enum: ['event', 'weather', 'disruption'],
        required: true
    },

    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },

    title: {
        type: String,
        required: true
    },

    description: String,

    // What we're suggesting to change
    changes: {
        original: mongoose.Schema.Types.Mixed, // Original activity/plan
        suggested: mongoose.Schema.Types.Mixed, // Suggested modification
        reasoning: String
    },

    // Extra context based on type
    eventDetails: {
        eventId: String,
        name: String,
        date: Date,
        location: String,
        category: String
    },

    weatherContext: {
        condition: String,
        temp: mongoose.Schema.Types.Mixed,
        precipitation: Number
    },

    disruptionContext: {
        type: String,
        severity: String
    },

    // User's response to this suggestion
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'modified'],
        default: 'pending'
    },

    userResponse: {
        action: String,
        modifiedPlan: mongoose.Schema.Types.Mixed,
        feedback: String,
        timestamp: Date
    },

    // Relevance score (0-100)
    score: {
        type: Number,
        default: 50
    },

    // Suggestions expire after the suggested date passes
    expiresAt: Date

}, {
    timestamps: true
});

// Index for faster queries
suggestionSchema.index({ itineraryId: 1, status: 1 });
suggestionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired suggestions

// Helper methods
suggestionSchema.methods.isPending = function () {
    return this.status === 'pending';
};

suggestionSchema.methods.accept = function (modifiedPlan = null) {
    this.status = modifiedPlan ? 'modified' : 'accepted';
    this.userResponse = {
        action: this.status,
        modifiedPlan: modifiedPlan,
        timestamp: new Date()
    };
    return this.save();
};

suggestionSchema.methods.reject = function (feedback = '') {
    this.status = 'rejected';
    this.userResponse = {
        action: 'rejected',
        feedback: feedback,
        timestamp: new Date()
    };
    return this.save();
};

module.exports = mongoose.model('Suggestion', suggestionSchema);
