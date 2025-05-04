import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Update the stateData array with more states
const stateData = [
  {
    state: 'Maharashtra',
    activeDrivers: 1200,
    totalRides: 15000,
    avgRating: 4.7,
    revenue: 450000,
    completionRate: 92,
    cancelRate: 8,
    peakHours: '9AM-11AM, 6PM-8PM',
    popularRoutes: ['Airport - City', 'Station - IT Park'],
    monthlyGrowth: 15
  },
  {
    state: 'Delhi',
    activeDrivers: 1500,
    totalRides: 18000,
    avgRating: 4.5,
    revenue: 520000,
    completionRate: 89,
    cancelRate: 11,
    peakHours: '8AM-10AM, 5PM-7PM',
    popularRoutes: ['Metro - Office Hub', 'Airport - Hotels'],
    monthlyGrowth: 18
  },
  {
    state: 'Karnataka',
    activeDrivers: 980,
    totalRides: 12000,
    avgRating: 4.6,
    revenue: 380000,
    completionRate: 94,
    cancelRate: 6,
    peakHours: '9AM-11AM, 5PM-8PM',
    popularRoutes: ['Tech Park - Airport', 'Metro - Tech Park'],
    monthlyGrowth: 12
  },
  {
    state: 'Tamil Nadu',
    activeDrivers: 850,
    totalRides: 10500,
    avgRating: 4.8,
    revenue: 320000,
    completionRate: 95,
    cancelRate: 5,
    peakHours: '8AM-10AM, 6PM-9PM',
    popularRoutes: ['IT Corridor - Airport', 'Beach - City'],
    monthlyGrowth: 14
  },
  {
    state: 'Gujarat',
    activeDrivers: 720,
    totalRides: 9000,
    avgRating: 4.4,
    revenue: 280000,
    completionRate: 91,
    cancelRate: 9,
    peakHours: '10AM-12PM, 5PM-7PM',
    popularRoutes: ['Diamond Market - Airport', 'Station - Business Hub'],
    monthlyGrowth: 16
  }
];

export default function StateWiseAnalytics() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stateData.map((data) => (
          <div key={data.state} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{data.state}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Active Drivers</p>
                  <p className="text-xl font-semibold text-blue-600">{data.activeDrivers}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-xl font-semibold text-green-600">₹{(data.revenue/1000).toFixed(1)}K</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium text-green-600">{data.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Growth</span>
                  <span className="font-medium text-blue-600">+{data.monthlyGrowth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Rating</span>
                  <span className="font-medium">{data.avgRating}/5.0</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-600">Peak Hours</p>
                <p className="text-sm">{data.peakHours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4F46E5" name="Revenue (₹)" />
              <Bar dataKey="totalRides" fill="#10B981" name="Total Rides" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 