import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicTripPlanner from './DynamicTripPlanner';
import { ArrowLeft } from 'lucide-react';

// Wrapper to load trip data from session storage
const DynamicPlannerPage = () => {
    const navigate = useNavigate();
    const [tripData, setTripData] = useState(null);

    useEffect(() => {
        // Load trip data from session storage
        const stored = sessionStorage.getItem('currentTrip');

        if (stored) {
            try {
                const data = JSON.parse(stored);
                setTripData(data);
            } catch (error) {
                console.error('Error parsing trip data:', error);
            }
        }
    }, []);

    if (!tripData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Trip Data Found</h2>
                    <p className="text-gray-600 mb-6">
                        Please generate a trip plan first
                    </p>
                    <button
                        onClick={() => navigate('/trip-planner')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go to Trip Planner
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DynamicTripPlanner
            tripData={tripData}
            onBack={() => navigate('/trip-planner')}
        />
    );
};

export default DynamicPlannerPage;
