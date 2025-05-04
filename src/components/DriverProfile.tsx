import React, { useState } from 'react';
import { User, Star, Car, DollarSign, CheckCircle, Shield, Calendar, AlertCircle } from 'lucide-react';

interface InsurancePlan {
  id: string;
  name: string;
  coverage: number;
  monthlyPremium: number;
  benefits: string[];
  isActive: boolean;
}

interface DriverProfileProps {
  driverProfile: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      aadharNo: string;
      address: string;
    };
    vehicleInfo: {
      licensePlate: string;
      vehicleModel: string;
      vehicleYear: string;
      insuranceNo: string;
    };
  };
  stats: {
    totalRides: number;
    rating: number;
    earnings: number;
    completionRate: number;
  };
}

export default function DriverProfile({ driverProfile, stats }: DriverProfileProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'insurance'>('profile');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const insurancePlans: InsurancePlan[] = [
    {
      id: 'basic',
      name: 'Basic Coverage',
      coverage: 100000,
      monthlyPremium: 499,
      benefits: [
        'Personal accident coverage up to ₹1 Lakh',
        'Third-party liability',
        'Basic medical expenses',
        '24/7 roadside assistance'
      ],
      isActive: false
    },
    {
      id: 'premium',
      name: 'Premium Coverage',
      coverage: 300000,
      monthlyPremium: 999,
      benefits: [
        'Personal accident coverage up to ₹3 Lakhs',
        'Enhanced third-party liability',
        'Comprehensive medical coverage',
        '24/7 premium roadside assistance',
        'Loss of earnings compensation',
        'Family health benefits'
      ],
      isActive: true
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Coverage',
      coverage: 500000,
      monthlyPremium: 1499,
      benefits: [
        'Personal accident coverage up to ₹5 Lakhs',
        'Maximum third-party liability',
        'Complete medical coverage',
        'Premium roadside assistance',
        'Loss of earnings compensation',
        'Family health benefits',
        'Vehicle damage coverage',
        'Natural calamity protection'
      ],
      isActive: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b">
        <div className="flex space-x-4 p-4">
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveSection('insurance')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeSection === 'insurance'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Insurance Plans
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSection === 'profile' ? (
          <>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{driverProfile.personalInfo.name}</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{stats.rating} Rating</span>
                  <span>•</span>
                  <span>{stats.totalRides} Rides</span>
                </div>
                <p className="text-sm text-gray-500">{driverProfile.personalInfo.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{stats.totalRides}</p>
                <p className="text-sm text-gray-600">Total Rides</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{stats.rating}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">₹{stats.earnings}</p>
                <p className="text-sm text-gray-600">Earnings</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Personal Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{driverProfile.personalInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{driverProfile.personalInfo.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Aadhar Number</p>
                      <p className="font-medium">{driverProfile.personalInfo.aadharNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Vehicle Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Model</p>
                      <p className="font-medium">{driverProfile.vehicleInfo.vehicleModel} ({driverProfile.vehicleInfo.vehicleYear})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">{driverProfile.vehicleInfo.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Insurance Number</p>
                      <p className="font-medium">{driverProfile.vehicleInfo.insuranceNo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold">Insurance Plans</h3>
                <p className="text-sm text-gray-600">Choose the right coverage for you and your vehicle</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {insurancePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 ${
                    plan.isActive ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-sm text-gray-600">Coverage up to ₹{plan.coverage.toLocaleString()}</p>
                    </div>
                    {plan.isActive && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">₹{plan.monthlyPremium}</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-2 rounded-lg font-medium ${
                      plan.isActive
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={plan.isActive}
                  >
                    {plan.isActive ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Insurance plans are subject to terms and conditions. Please read the policy documents carefully before making a selection. Plan changes will take effect from the next billing cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 