import React from 'react';
import {
    CheckCircle,
    XCircle,
    Edit,
    Calendar,
    MapPin,
    Sparkles,
    CloudRain,
    AlertTriangle
} from 'lucide-react';

// Component for displaying individual suggestions with action buttons
const SuggestionCard = ({ suggestion, onAccept, onReject, onModify }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-red-400 bg-red-50';
            case 'medium':
                return 'border-yellow-400 bg-yellow-50';
            case 'low':
                return 'border-blue-400 bg-blue-50';
            default:
                return 'border-gray-400 bg-gray-50';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'event':
                return <Sparkles className="w-5 h-5 text-purple-600" />;
            case 'weather':
                return <CloudRain className="w-5 h-5 text-blue-600" />;
            case 'disruption':
                return <AlertTriangle className="w-5 h-5 text-orange-600" />;
            default:
                return <Calendar className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTypeBadge = (type) => {
        const styles = {
            event: 'bg-purple-100 text-purple-700',
            weather: 'bg-blue-100 text-blue-700',
            disruption: 'bg-orange-100 text-orange-700'
        };

        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className={`border-2 rounded-lg p-5 ${getPriorityColor(suggestion.priority)}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                        {getTypeIcon(suggestion.suggestionType)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900">{suggestion.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(suggestion.suggestionType)}`}>
                                {suggestion.suggestionType.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Day {suggestion.day}</p>
                    </div>
                </div>

                {/* Priority badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${suggestion.priority === 'high'
                        ? 'bg-red-200 text-red-800'
                        : suggestion.priority === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                    }`}>
                    {suggestion.priority}
                </span>
            </div>

            {/* Description */}
            {suggestion.description && (
                <p className="text-gray-700 mb-4">{suggestion.description}</p>
            )}

            {/* Changes */}
            {suggestion.changes && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Suggested Changes:</h4>

                    {suggestion.changes.suggested && (
                        <div className="space-y-2">
                            {suggestion.suggestionType === 'event' && suggestion.eventDetails && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">{suggestion.eventDetails.name}</span>
                                    </div>
                                    {suggestion.eventDetails.location && (
                                        <p className="text-sm text-gray-600 ml-6">{suggestion.eventDetails.location}</p>
                                    )}
                                    {suggestion.eventDetails.category && (
                                        <p className="text-xs text-gray-500 ml-6 capitalize">{suggestion.eventDetails.category}</p>
                                    )}
                                </div>
                            )}

                            {suggestion.changes.suggested.suggestion && (
                                <p className="text-sm text-gray-700">{suggestion.changes.suggested.suggestion}</p>
                            )}
                        </div>
                    )}

                    {suggestion.changes.reasoning && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600 italic">
                                <strong>Why?</strong> {suggestion.changes.reasoning}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Weather context if applicable */}
            {suggestion.weatherContext && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CloudRain className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-blue-900">Weather Forecast</span>
                    </div>
                    <div className="text-sm text-blue-800">
                        {suggestion.weatherContext.condition} • {suggestion.weatherContext.temp?.max}°C
                        {suggestion.weatherContext.precipitation && ` • ${suggestion.weatherContext.precipitation}% rain`}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onAccept(suggestion)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <CheckCircle className="w-5 h-5" />
                    Accept
                </button>

                {suggestion.suggestionType === 'event' && onModify && (
                    <button
                        onClick={() => onModify(suggestion)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                        Modify
                    </button>
                )}

                <button
                    onClick={() => onReject(suggestion)}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <XCircle className="w-5 h-5" />
                    Reject
                </button>
            </div>
        </div>
    );
};

export default SuggestionCard;
