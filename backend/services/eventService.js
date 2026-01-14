// Event service - handles discovering events and festivals happening during trips
// Uses a combo of APIs to find local happenings

const axios = require('axios');

class EventService {
  constructor() {
    // Using Eventbrite as our primary source for now
    // TODO: maybe add PredictHQ later if we need more coverage
    this.eventbriteToken = process.env.EVENTBRITE_API_KEY;
    this.baseURL = 'https://www.eventbriteapi.com/v3';
  }

  // Fetch events near a destination during specific dates
  async fetchNearbyEvents(location, startDate, endDate, radiusKm = 25) {
    try {
      // If we don't have proper API key, return some mock data for testing
      if (!this.eventbriteToken || this.eventbriteToken === 'your_eventbrite_api_key') {
        console.log('No Eventbrite API key found, using mock data');
        return this._getMockEvents(location, startDate, endDate);
      }

      // Build the API request
      const params = {
        'location.address': location,
        'location.within': `${radiusKm}km`,
        'start_date.range_start': new Date(startDate).toISOString(),
        'start_date.range_end': new Date(endDate).toISOString(),
        expand: 'venue,category',
        sort_by: 'date'
      };

      const response = await axios.get(`${this.baseURL}/events/search/`, {
        headers: {
          'Authorization': `Bearer ${this.eventbriteToken}`
        },
        params,
        timeout: 10000 // 10 second timeout
      });

      // Transform the response into our standard format
      const events = response.data.events.map(event => this._transformEvent(event));
      return events;

    } catch (error) {
      console.error('Error fetching events:', error.message);
      // Fallback to mock data if API fails
      return this._getMockEvents(location, startDate, endDate);
    }
  }

  // Get events filtered by category/type
  async getEventsByType(location, type, startDate, endDate) {
    const allEvents = await this.fetchNearbyEvents(location, startDate, endDate);
    
    // Filter by category if specified
    if (type && type !== 'all') {
      return allEvents.filter(event => 
        event.category.toLowerCase() === type.toLowerCase()
      );
    }
    
    return allEvents;
  }

  // Transform Eventbrite event into our standard format
  _transformEvent(eventbriteEvent) {
    return {
      eventId: eventbriteEvent.id,
      name: eventbriteEvent.name.text,
      description: eventbriteEvent.description?.text || '',
      category: this._categorizeEvent(eventbriteEvent),
      date: new Date(eventbriteEvent.start.local),
      endDate: new Date(eventbriteEvent.end.local),
      location: {
        name: eventbriteEvent.venue?.name || 'TBA',
        address: eventbriteEvent.venue?.address?.localized_address_display || '',
        coordinates: {
          lat: parseFloat(eventbriteEvent.venue?.latitude) || 0,
          lng: parseFloat(eventbriteEvent.venue?.longitude) || 0
        }
      },
      url: eventbriteEvent.url,
      isFree: eventbriteEvent.is_free,
      source: 'eventbrite',
      relevanceScore: 0 // Will be calculated based on user preferences
    };
  }

  // Categorize events into our standard types
  _categorizeEvent(event) {
    const categoryName = event.category?.name?.toLowerCase() || '';
    
    // Map Eventbrite categories to our simpler categories
    if (categoryName.includes('music') || categoryName.includes('concert')) return 'music';
    if (categoryName.includes('food') || categoryName.includes('drink')) return 'food';
    if (categoryName.includes('art') || categoryName.includes('culture')) return 'cultural';
    if (categoryName.includes('festival')) return 'festival';
    if (categoryName.includes('sport')) return 'sports';
    if (categoryName.includes('business') || categoryName.includes('professional')) return 'business';
    if (categoryName.includes('community')) return 'community';
    
    return 'other';
  }

  // Calculate how relevant an event is based on user interests
  calculateRelevanceScore(event, userInterests = []) {
    let score = 50; // Base score
    
    // Boost score if event category matches user interests
    if (userInterests.length > 0) {
      const interestMatch = userInterests.some(interest => 
        event.category.toLowerCase().includes(interest.toLowerCase()) ||
        event.name.toLowerCase().includes(interest.toLowerCase())
      );
      
      if (interestMatch) score += 30;
    }
    
    // Free events get a small boost
    if (event.isFree) score += 10;
    
    // Festivals and cultural events generally more interesting for tourists
    if (event.category === 'festival' || event.category === 'cultural') {
      score += 15;
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  // Mock data for testing when API isn't available
  _getMockEvents(location, startDate, endDate) {
    return [
      {
        eventId: 'mock-1',
        name: 'Summer Music Festival',
        description: 'Annual celebration of local and international music',
        category: 'festival',
        date: new Date(startDate),
        endDate: new Date(startDate),
        location: {
          name: 'City Park',
          address: location,
          coordinates: { lat: 0, lng: 0 }
        },
        url: '#',
        isFree: false,
        source: 'mock',
        relevanceScore: 85
      },
      {
        eventId: 'mock-2',
        name: 'Food Market Weekend',
        description: 'Try local cuisines and street food',
        category: 'food',
        date: new Date(startDate),
        endDate: new Date(endDate),
        location: {
          name: 'Downtown Square',
          address: location,
          coordinates: { lat: 0, lng: 0 }
        },
        url: '#',
        isFree: true,
        source: 'mock',
        relevanceScore: 75
      },
      {
        eventId: 'mock-3',
        name: 'Art Gallery Opening',
        description: 'Contemporary art exhibition opening night',
        category: 'cultural',
        date: new Date(new Date(startDate).getTime() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(new Date(startDate).getTime() + 2 * 24 * 60 * 60 * 1000),
        location: {
          name: 'Modern Art Museum',
          address: location,
          coordinates: { lat: 0, lng: 0 }
        },
        url: '#',
        isFree: true,
        source: 'mock',
        relevanceScore: 70
      }
    ];
  }
}

module.exports = new EventService();
