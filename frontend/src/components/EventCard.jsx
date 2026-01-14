import React from 'react';
import { Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';

// Card component for displaying event details
const EventCard = ({ event, onAddToItinerary }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            festival: 'bg-purple-100 text-purple-700',
            music: 'bg-pink-100 text-pink-700',
            cultural: 'bg-blue-100 text-blue-700',
            food: 'bg-orange-100 text-orange-700',
            sports: 'bg-green-100 text-green-700',
            community: 'bg-yellow-100 text-yellow-700',
            other: 'bg-gray-100 text-gray-700'
        };

        return colors[category] || colors.other;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            {/* Event name and category */}
            <div className="mb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 flex-1">{event.name}</h3>
                    {event.isFree && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            FREE
                        </span>
                    )}
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    <Tag className="w-3 h-3 inline mr-1" />
                    {event.category}
                </span>
            </div>

            {/* Description */}
            {event.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                </p>
            )}

            {/* Date and location */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(event.date)}</span>
                </div>

                {event.location && event.location.name && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{event.location.name}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {onAddToItinerary && (
                    <button
                        onClick={() => onAddToItinerary(event)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        Add to Itinerary
                    </button>
                )}

                {event.url && event.url !== '#' && (
                    <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Details
                    </a>
                )}
            </div>

            {/* Relevance score (for debugging, can be hidden in production) */}
            {event.relevanceScore && event.relevanceScore > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                    Relevance: {event.relevanceScore}/100
                </div>
            )}
        </div>
    );
};

export default EventCard;
