// Disruption monitoring - tracks closures, strikes, and other travel disruptions
// For now using mock data, but can be extended with real-time alert APIs

class DisruptionService {
    constructor() {
        // In the future, could integrate with:
        // - Google Crisis API
        // - Local government alert systems
        // - News APIs for real-time updates
        this.mockMode = true;
    }

    // Check if attractions are open/available
    async checkAttractionStatus(location, date, attractions = []) {
        try {
            // For now, return mock data
            // In production, would check against real-time databases
            const statuses = attractions.map(attraction => ({
                name: attraction,
                status: 'open', // 'open', 'closed', 'limited'
                lastChecked: new Date(),
                notes: null
            }));

            // Randomly flag one as having issues for demo purposes
            if (Math.random() > 0.8 && statuses.length > 0) {
                statuses[0].status = 'closed';
                statuses[0].notes = 'Temporarily closed for renovations';
            }

            return statuses;

        } catch (error) {
            console.error('Error checking attractions:', error);
            return [];
        }
    }

    // Get alternative attractions if primary ones are unavailable
    getAlternativeAttractions(closedAttraction, location, userPreferences = []) {
        // This is a simplified version - in production would use a database
        // of attractions categorized by type and location

        const alternatives = [
            {
                name: 'Local Museum',
                type: 'cultural',
                reason: 'Similar cultural experience',
                distance: '2.5 km away',
                rating: 4.5
            },
            {
                name: 'Historic District Walking Tour',
                type: 'sightseeing',
                reason: 'Great alternative for history lovers',
                distance: '1.8 km away',
                rating: 4.7
            },
            {
                name: 'Botanical Gardens',
                type: 'nature',
                reason: 'Popular outdoor attraction nearby',
                distance: '3.2 km away',
                rating: 4.6
            }
        ];

        // Filter based on user preferences if provided
        if (userPreferences.length > 0) {
            return alternatives.filter(alt =>
                userPreferences.some(pref =>
                    alt.type.toLowerCase().includes(pref.toLowerCase())
                )
            );
        }

        return alternatives.slice(0, 3); // Return top 3
    }

    // Get current disruptions for a location
    async getCurrentDisruptions(location, startDate, endDate) {
        // Mock disruption data
        // In production, would aggregate from multiple sources

        const disruptions = [];

        // Simulate some potential disruptions
        const disruptionTypes = [
            {
                type: 'public_transport',
                title: 'Metro Line Maintenance',
                description: 'Blue line will be closed on weekends',
                severity: 'moderate',
                affectedDates: this._getWeekendDates(startDate, endDate),
                mitigation: 'Use alternative bus routes or taxis'
            },
            {
                type: 'closure',
                title: 'City Marathon Event',
                description: 'Main streets closed for annual marathon',
                severity: 'low',
                affectedDates: [new Date(startDate)],
                mitigation: 'Plan routes around downtown area'
            }
        ];

        // Only return disruptions that fall within travel dates (randomly for demo)
        if (Math.random() > 0.6) {
            disruptions.push(disruptionTypes[Math.floor(Math.random() * disruptionTypes.length)]);
        }

        return disruptions;
    }

    // Helper to get weekend dates in range
    _getWeekendDates(start, end) {
        const weekends = [];
        const current = new Date(start);
        const endDate = new Date(end);

        while (current <= endDate) {
            const day = current.getDay();
            if (day === 0 || day === 6) { // Sunday or Saturday
                weekends.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }

        return weekends;
    }

    // Check for safety alerts in the area
    async getSafetyAlerts(location) {
        // Mock safety alerts
        // Real implementation would use government travel advisories, news APIs, etc.

        const mockAlerts = [
            {
                level: 'low',
                category: 'general',
                message: 'Exercise normal precautions',
                lastUpdated: new Date()
            }
        ];

        return mockAlerts;
    }

    // Categorize disruption severity
    categorizeSeverity(disruption) {
        // Help prioritize which disruptions need immediate attention
        const severityLevels = {
            'high': {
                priority: 1,
                requiresAction: true,
                suggestReplanning: true
            },
            'moderate': {
                priority: 2,
                requiresAction: true,
                suggestReplanning: false
            },
            'low': {
                priority: 3,
                requiresAction: false,
                suggestReplanning: false
            }
        };

        return severityLevels[disruption.severity] || severityLevels['low'];
    }
}

module.exports = new DisruptionService();
