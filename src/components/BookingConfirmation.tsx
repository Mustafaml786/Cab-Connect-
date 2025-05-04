import React from 'react';
import { MapPin, Clock, DollarSign, Users, Shield } from 'lucide-react';

interface BookingConfirmationProps {
  pickup: string;
  dropoff: string;
  distance: number;
  duration: number;
  price: number;
  isShared: boolean;
  vehicleType: string;
  hasInsurance: boolean;
  insurancePrice: number;
  onConfirm: () => void;
  onBack: () => void;
}

export default function BookingConfirmation({
  pickup,
  dropoff,
  distance,
  duration,
  price,
  isShared,
  vehicleType,
  hasInsurance,
  insurancePrice,
  onConfirm,
  onBack
}: BookingConfirmationProps) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Confirm Your Ride</h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-medium">{pickup}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-red-600 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Dropoff</p>
            <p className="font-medium">{dropoff}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Duration</span>
          </div>
          <p className="font-medium mt-1">{Math.round(duration)} mins</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Price</span>
          </div>
          <p className="font-medium mt-1">₹{price}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Vehicle Type</span>
          <span className="font-medium capitalize">{vehicleType}</span>
        </div>
        {isShared && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <Users className="w-4 h-4" />
            <span>Shared Ride - 40% off applied</span>
          </div>
        )}
        {hasInsurance && (
          <div className="flex justify-between text-sm text-gray-600 mb-2 mt-2">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Ride Insurance</span>
            </div>
            <span className="font-medium">₹{insurancePrice}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Confirm ₹{price}
        </button>
      </div>
    </div>
  );
} 