import React, { useState } from 'react';
import { Shield, Check, ChevronRight } from 'lucide-react';

interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  coverageAmount: string;
  features: string[];
  recommended?: boolean;
}

interface InsuranceProps {
  userType: 'rider' | 'driver';
}

export default function Insurance({ userType }: InsuranceProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const riderPlans: InsurancePlan[] = [
    {
      id: 'r1',
      name: 'Basic Protection',
      price: 2.99,
      coverageAmount: '$10,000',
      features: [
        'Personal accident coverage',
        'Emergency medical expenses',
        'Trip cancellation protection'
      ]
    },
    {
      id: 'r2',
      name: 'Premium Protection',
      price: 5.99,
      coverageAmount: '$25,000',
      features: [
        'Personal accident coverage',
        'Emergency medical expenses',
        'Trip cancellation protection',
        'Lost baggage coverage',
        'Phone damage protection'
      ],
      recommended: true
    }
  ];

  const driverPlans: InsurancePlan[] = [
    {
      id: 'd1',
      name: 'Basic Coverage',
      price: 9.99,
      coverageAmount: '$50,000',
      features: [
        'Third-party liability',
        'Vehicle damage coverage',
        'Medical expenses',
        'Loss of income protection'
      ]
    },
    {
      id: 'd2',
      name: 'Premium Coverage',
      price: 19.99,
      coverageAmount: '$100,000',
      features: [
        'Comprehensive third-party liability',
        'Full vehicle damage coverage',
        'Enhanced medical expenses',
        'Loss of income protection',
        'Legal assistance',
        'Personal accident coverage'
      ],
      recommended: true
    }
  ];

  const plans = userType === 'rider' ? riderPlans : driverPlans;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">CabConnect Insurance</h1>
      </div>

      <p className="text-gray-600 mb-8">
        {userType === 'rider'
          ? 'Protect yourself during rides with our simple and affordable coverage options.'
          : 'Protect your vehicle and livelihood with our comprehensive insurance plans.'}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`border rounded-lg p-6 relative cursor-pointer transition-all ${
              selectedPlan === plan.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            } ${plan.recommended ? 'ring-2 ring-green-400' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                Recommended
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold text-blue-600">${plan.price}</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <p className="mt-2 text-gray-600">Coverage up to {plan.coverageAmount}</p>
            
            <div className="mt-4 space-y-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {selectedPlan && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Your Selected Plan</h3>
          <p className="text-blue-600 mt-2">
            You've selected {plans.find(p => p.id === selectedPlan)?.name}. 
          </p>
          <div className="mt-4 flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center">
              Subscribe Now <ChevronRight className="ml-2 h-4 w-4" />
            </button>
            <button 
              onClick={() => setSelectedPlan(null)}
              className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>CabConnect Insurance is provided in partnership with trusted insurance providers.</p>
        <p className="mt-1">For assistance, contact our support at <span className="text-blue-600">insurance@cabconnect.com</span></p>
      </div>
    </div>
  );
} 