import { API_BASE_URL } from "../config/auth";

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: userData,
    });
  },

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  // Itinerary endpoints
  async saveItinerary(itineraryData) {
    return this.request('/itinerary/save', {
      method: 'POST',
      body: itineraryData,
    });
  },

  async analyzeItinerary(itineraryId) {
    return this.request('/itinerary/analyze', {
      method: 'POST',
      body: { itineraryId },
    });
  },

  async getItinerary(id) {
    return this.request(`/itinerary/${id}`);
  },

  async getSuggestions(itineraryId, status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/itinerary/${itineraryId}/suggestions${query}`);
  },

  async applySuggestion(itineraryId, suggestionId, modifiedPlan = null) {
    return this.request(`/itinerary/${itineraryId}/apply`, {
      method: 'PATCH',
      body: { suggestionId, modifiedPlan },
    });
  },

  async rejectSuggestion(itineraryId, suggestionId, feedback = '') {
    return this.request(`/itinerary/${itineraryId}/reject`, {
      method: 'PATCH',
      body: { suggestionId, feedback },
    });
  },

  // Event endpoints
  async getNearbyEvents(location, startDate, endDate, radius = 25) {
    const params = new URLSearchParams({
      location,
      startDate,
      endDate,
      radius: radius.toString()
    });
    return this.request(`/events/nearby?${params}`);
  },

  async getEventsByCategory(location, category, startDate, endDate) {
    const params = new URLSearchParams({
      location,
      startDate,
      endDate
    });
    return this.request(`/events/category/${category}?${params}`);
  },

  // Weather endpoints
  async getWeatherForecast(location, startDate, endDate) {
    const params = new URLSearchParams({
      location,
      startDate,
      endDate
    });
    return this.request(`/weather/forecast?${params}`);
  },

  async getWeatherDisruptions(location, startDate, endDate) {
    const params = new URLSearchParams({
      location,
      startDate,
      endDate
    });
    return this.request(`/weather/disruptions?${params}`);
  },
};

