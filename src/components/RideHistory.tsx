import React, { useState } from 'react';
import { Calendar, Search, Filter, MapPin, Clock, DollarSign } from 'lucide-react';

interface Ride {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  amount: number;
  status: 'completed' | 'cancelled';
  duration: number;
  distance: number;
  driverName?: string;
  riderName?: string;
  rating?: number;
}

interface RideHistoryProps {
  userType: 'rider' | 'driver';
}

export default function RideHistory({ userType }: RideHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API calls
  const rides: Ride[] = Array.from({ length: 20 }, (_, index) => ({
    id: `RIDE${index + 1}`,
    date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
    pickup: ['Sector 18, Noida', 'Connaught Place, Delhi', 'Cyber City, Gurugram'][Math.floor(Math.random() * 3)],
    dropoff: ['IGI Airport', 'Select City Walk, Saket', 'DLF Mall of India'][Math.floor(Math.random() * 3)],
    amount: Math.floor(Math.random() * 1000) + 200,
    status: Math.random() > 0.2 ? 'completed' : 'cancelled',
    duration: Math.floor(Math.random() * 60) + 20,
    distance: Math.floor(Math.random() * 20) + 5,
    driverName: userType === 'rider' ? `Driver ${index + 1}` : undefined,
    riderName: userType === 'driver' ? `Rider ${index + 1}` : undefined,
    rating: Math.floor(Math.random() * 2) + 4
  }));

  const filteredRides = rides.filter(ride => {
    const matchesSearch = 
      ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.dropoff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;

    if (dateFilter === 'all') return matchesSearch && matchesStatus;
    
    const rideDate = new Date(ride.date);
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return matchesSearch && matchesStatus && (
      (dateFilter === 'today' && rideDate.toDateString() === today.toDateString()) ||
      (dateFilter === 'week' && rideDate >= lastWeek) ||
      (dateFilter === 'month' && rideDate >= lastMonth)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Ride History</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search rides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Ride {ride.id}</h3>
                <p className="text-gray-500">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {new Date(ride.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ride.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ride.status}
                </span>
                {ride.rating && (
                  <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    ★ {ride.rating}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p>{ride.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Dropoff</p>
                    <p>{ride.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{ride.duration} mins</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  <span>₹{ride.amount}</span>
                </div>
                {userType === 'rider' && ride.driverName && (
                  <div className="flex items-center">
                    <span className="text-gray-500">Driver:</span>
                    <span className="ml-2">{ride.driverName}</span>
                  </div>
                )}
                {userType === 'driver' && ride.riderName && (
                  <div className="flex items-center">
                    <span className="text-gray-500">Rider:</span>
                    <span className="ml-2">{ride.riderName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 