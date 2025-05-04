import React from 'react';
import { User, Star, Loader } from 'lucide-react';
import type { CoPassenger } from '../types';

interface CoPassengerFinderProps {
  searching: boolean;
  coPassenger: CoPassenger | null;
  onConfirm: () => void;
  onChat: () => void;
}

export default function CoPassengerFinder({
  searching,
  coPassenger,
  onConfirm,
  onChat
}: CoPassengerFinderProps) {
  if (searching) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-12 h-12 mx-auto mb-4">
          <Loader className="w-full h-full text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Finding a Co-Passenger</h3>
        <p className="text-gray-600">Looking for someone heading in the same direction...</p>
      </div>
    );
  }

  if (coPassenger) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Co-Passenger Found!</h3>
          <p className="text-gray-600">Someone wants to share the ride with you</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{coPassenger.name}</p>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">{coPassenger.rating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>Pickup: {coPassenger.pickupLocation}</p>
            <p>Dropoff: {coPassenger.dropoffLocation}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onChat}
            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Chat First
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm Ride
          </button>
        </div>
      </div>
    );
  }

  return null;
}