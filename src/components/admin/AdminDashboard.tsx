import React, { useState } from 'react';
import { Users, MessageSquare, BarChart2, Settings } from 'lucide-react';
import DriverManagement from './DriverManagement';
import QueryManagement from './QueryManagement';
import StateWiseAnalytics from './StateWiseAnalytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  const stats = {
    totalDrivers: 3250,
    activeDrivers: 2180,
    pendingApprovals: 45,
    totalRides: 25800,
    totalRevenue: 1250000,
    openQueries: 28,
    avgRating: 4.6,
    monthlyGrowth: 15
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage drivers, queries, and view analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drivers</p>
              <p className="text-2xl font-semibold">{stats.totalDrivers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+{stats.monthlyGrowth}% this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold">₹{(stats.totalRevenue/100000).toFixed(1)}L</p>
            </div>
            <BarChart2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12% this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Queries</p>
              <p className="text-2xl font-semibold">{stats.openQueries}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-sm text-orange-600 mt-2">{stats.pendingApprovals} need attention</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold">{stats.avgRating}/5.0</p>
            </div>
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-purple-600 mt-2">Based on {stats.totalRides} rides</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'drivers'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'queries'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Support Queries
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analytics' && <StateWiseAnalytics />}
          {activeTab === 'drivers' && <DriverManagement />}
          {activeTab === 'queries' && <QueryManagement />}
        </div>
      </div>
    </div>
  );
} 