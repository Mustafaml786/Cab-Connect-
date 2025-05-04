import React, { useState } from 'react';
import { Car, Star, DollarSign, Users, Clock, Briefcase, CheckCircle, XCircle, Loader2, Search, X, User, MapPin, Phone, Navigation, Navigation2, AlertTriangle, PhoneCall, MessageSquare, Shield, RefreshCw, Check } from 'lucide-react';
import RideHistory from './RideHistory';
import DriverProfile from './DriverProfile';

interface DriverProfile {
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
  status: 'pending' | 'approved' | 'rejected';
}

interface PassengerRequest {
  id: string;
  name: string;
  phone: string;
  rating: number;
  pickup: string;
  dropoff: string;
  distance: number;
  duration: number;
  fare: number;
  timestamp: Date;
  paymentMethod: 'cash' | 'online';
}

interface DriverStatus {
  isOnline: boolean;
  totalTripsToday: number;
  totalEarningsToday: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface DriverLocation {
  lat: number;
  lng: number;
  address: string;
}

interface DummyPassenger extends PassengerRequest {
  id: string;
  name: string;
  phone: string;
  rating: number;
  pickup: string;
  dropoff: string;
  distance: number;
  duration: number;
  fare: number;
  timestamp: Date;
  paymentMethod: 'cash' | 'online';
  profilePic?: string;
  distanceFromDriver: number;
  estimatedReachTime: number;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface DriverDashboardProps {
  isRegistered: boolean;
  driverProfile?: DriverProfile;
  onRegister: (data: DriverProfile) => void;
}

export default function DriverDashboard({ isRegistered, driverProfile, onRegister }: DriverDashboardProps) {
  const [registrationStep, setRegistrationStep] = useState<'initial' | 'personal' | 'vehicle' | 'pending'>('initial');
  const [activeTab, setActiveTab] = useState<'find-ride' | 'history' | 'profile'>('find-ride');
  const [formData, setFormData] = useState<DriverProfile>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      aadharNo: '',
      address: '',
    },
    vehicleInfo: {
      licensePlate: '',
      vehicleModel: '',
      vehicleYear: '',
      insuranceNo: '',
    },
    status: 'pending',
  });
  const [isSearchingPassengers, setIsSearchingPassengers] = useState(false);
  const [currentRide, setCurrentRide] = useState<PassengerRequest | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [activeView, setActiveView] = useState<'profile' | 'rides'>('profile');
  const [rideStatus, setRideStatus] = useState<'searching' | 'found' | 'accepted' | 'in-progress' | 'completed' | null>(null);
  const [driverStatus, setDriverStatus] = useState<DriverStatus>({
    isOnline: true,
    totalTripsToday: 0,
    totalEarningsToday: 0
  });
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [availablePassengers, setAvailablePassengers] = useState<DummyPassenger[]>([]);
  const [showPassengerList, setShowPassengerList] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpInput, setOtpInput] = useState('');
  const [currentRideStatus, setCurrentRideStatus] = useState<'accepted' | 'started' | 'completed' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState<DriverLocation>({
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, Delhi'
  });
  const [sortBy, setSortBy] = useState<'distance' | 'fare'>('distance');

  const stats = {
    totalRides: 156,
    rating: 4.8,
    earnings: 12500,
    completionRate: 98
  };

  const mockPassengerRequest: PassengerRequest = {
    id: 'p1',
    name: 'John Doe',
    phone: '+91 98765 43210',
    rating: 4.5,
    pickup: 'Connaught Place, New Delhi',
    dropoff: 'Cyber City, Gurugram',
    distance: 28.5,
    duration: 45, 
    fare: 450,
    timestamp: new Date(),
    paymentMethod: 'online'
  };

  const handleChange = (section: 'personalInfo' | 'vehicleInfo', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationStep === 'personal') {
      setRegistrationStep('vehicle');
    } else if (registrationStep === 'vehicle') {
      onRegister(formData);
      setRegistrationStep('pending');
      // Simulate admin approval after 15 seconds
      setTimeout(() => {
        onRegister({ ...formData, status: 'approved' });
      }, 15000);
    }
  };

  const handleStartSearching = () => {
    setRideStatus('searching');
    // Simulate finding a passenger after 5 seconds
    setTimeout(() => {
      setCurrentRide(mockPassengerRequest);
      setRideStatus('found');
    }, 5000);
  };

  const handleAcceptRide = () => {
    setRideStatus('accepted');
    setCurrentRideStatus('accepted');
    // Clear available passengers list when accepting a ride
    setAvailablePassengers([]);
  };

  const handleCancelRide = () => {
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      setCurrentRide(null);
      setRideStatus(null);
    }
  };

  const toggleOnlineStatus = () => {
    setDriverStatus(prev => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
  };

  const handleStartTrip = () => {
    setRideStatus('in-progress');
    // Start trip timer and location tracking
  };

  const handleEndTrip = () => {
    if (window.confirm('Are you sure you want to end this trip?')) {
      setRideStatus('completed');
      setDriverStatus(prev => ({
        ...prev,
        totalTripsToday: prev.totalTripsToday + 1,
        totalEarningsToday: prev.totalEarningsToday + (currentRide?.fare || 0)
      }));
      
      setTimeout(() => {
        setCurrentRide(null);
        setRideStatus(null);
      }, 3000);
    }
  };

  const handleEmergency = () => {
    setShowEmergencyModal(true);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const generateDummyPassengers = (): DummyPassenger[] => {
    const locations = [
      { 
        address: 'Connaught Place, Delhi',
        lat: 28.6289, 
        lng: 77.2065
      },
      { 
        address: 'Lajpat Nagar, Delhi',
        lat: 28.5700, 
        lng: 77.2373
      },
      { 
        address: 'Saket, Delhi',
        lat: 28.5244, 
        lng: 77.2167
      },
      { 
        address: 'Dwarka, Delhi',
        lat: 28.5921, 
        lng: 77.0460
      },
      { 
        address: 'Rohini, Delhi',
        lat: 28.7197, 
        lng: 77.1240
      }
    ];

    const dropLocations = [
      { address: 'Cyber City, Gurugram', lat: 28.4957, lng: 77.0881 },
      { address: 'Noida Sector 18', lat: 28.5708, lng: 77.3260 },
      { address: 'Greater Noida', lat: 28.4744, lng: 77.5040 },
      { address: 'Faridabad', lat: 28.4089, lng: 77.3178 },
      { address: 'Ghaziabad', lat: 28.6692, lng: 77.4538 }
    ];

    const names = [
      'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Singh', 'Raj Malhotra',
      'Anita Gupta', 'Sanjay Verma', 'Meera Kapoor', 'Vikram Mehta', 'Pooja Reddy'
    ];

    return Array.from({ length: 30 }, (_, i) => {
      const pickupLocation = locations[Math.floor(Math.random() * locations.length)];
      const dropLocation = dropLocations[Math.floor(Math.random() * dropLocations.length)];
      const distanceFromDriver = calculateDistance(
        driverLocation.lat,
        driverLocation.lng,
        pickupLocation.lat,
        pickupLocation.lng
      );
      const estimatedReachTime = Math.round(distanceFromDriver * 3); // Assuming 20 km/h average speed
      const rideDistance = calculateDistance(
        pickupLocation.lat,
        pickupLocation.lng,
        dropLocation.lat,
        dropLocation.lng
      );
      const fare = Math.round(rideDistance * (Math.floor(Math.random() * 10) + 15));
      
      return {
        id: `p${i + 1}`,
        name: names[Math.floor(Math.random() * names.length)],
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        rating: Number((Math.random() * 2 + 3).toFixed(1)),
        pickup: pickupLocation.address,
        dropoff: dropLocation.address,
        pickupLocation: pickupLocation,
        distance: rideDistance,
        duration: Math.round(rideDistance * 3),
        fare,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        paymentMethod: Math.random() > 0.5 ? 'cash' : 'online',
        distanceFromDriver,
        estimatedReachTime
      };
    });
  };

  const refreshPassengers = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setAvailablePassengers(generateDummyPassengers());
      setIsLoading(false);
    }, 1000);
  };

  const generateOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    console.log('Generated OTP:', newOtp);
    return newOtp;
  };

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setShowOtpModal(false);
      setCurrentRideStatus('started');
      setRideStatus('in-progress');
      setOtpInput('');
      alert('OTP verified! Ride started.');
    } else {
      alert('Invalid OTP! Please try again.');
    }
  };

  const handleCancelOtp = () => {
    setShowOtpModal(false);
    setOtpInput('');
  };

  const OtpVerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">Verify Passenger's OTP</h3>
          <p className="text-gray-600 mt-2">Ask passenger for their OTP</p>
          <p className="text-sm text-blue-600 mt-1">Expected OTP: {generatedOtp}</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            maxLength={4}
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
            className="w-full text-center text-2xl tracking-widest py-2 border rounded-lg"
            placeholder="****"
          />

          <div className="flex space-x-3">
            <button
              onClick={handleCancelOtp}
              className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={otpInput.length !== 4}
              className={`flex-1 py-2 rounded-lg text-white transition-colors ${
                otpInput.length === 4 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Verify & Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isRegistered) {
    if (registrationStep === 'initial') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center mb-8">
            <Car className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Drive with SmartCab</h2>
            <p className="text-gray-600">Join our community of professional drivers and start earning</p>
          </div>
          <button
            onClick={() => setRegistrationStep('personal')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Apply to Drive
          </button>
        </div>
      );
    }

    if (registrationStep === 'pending') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-4">Application Under Review</h2>
          <p className="text-gray-600 mb-4">
            Our team is reviewing your application. This typically takes about 2 minutes.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-500">Please wait while we verify your information</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-3 mb-6">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold">
            {registrationStep === 'personal' ? 'Personal Information' : 'Vehicle Details'}
          </h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                1
              </div>
              <div className={`h-1 w-16 ${registrationStep === 'personal' ? 'bg-gray-300' : 'bg-blue-600'}`} />
            </div>
            <div className="flex items-center">
              <div className={`${registrationStep === 'personal' ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white'} w-8 h-8 rounded-full flex items-center justify-center`}>
                2
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {registrationStep === 'personal' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.name}
                  onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                <input
                  type="text"
                  value={formData.personalInfo.aadharNo}
                  onChange={(e) => handleChange('personalInfo', 'aadharNo', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.personalInfo.address}
                  onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate Number</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.licensePlate}
                  onChange={(e) => handleChange('vehicleInfo', 'licensePlate', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.vehicleModel}
                  onChange={(e) => handleChange('vehicleInfo', 'vehicleModel', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Year</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.vehicleYear}
                  onChange={(e) => handleChange('vehicleInfo', 'vehicleYear', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                <input
                  type="text"
                  value={formData.vehicleInfo.insuranceNo}
                  onChange={(e) => handleChange('vehicleInfo', 'insuranceNo', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="flex space-x-4">
            {registrationStep === 'vehicle' && (
              <button
                type="button"
                onClick={() => setRegistrationStep('personal')}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {registrationStep === 'personal' ? 'Next' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const RidesView = () => {
    const sortedPassengers = [...availablePassengers].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceFromDriver - b.distanceFromDriver;
      }
      return b.fare - a.fare;
    });

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${driverStatus.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="font-medium">{driverStatus.isOnline ? 'Online' : 'Offline'}</span>
          </div>
            <button
              onClick={refreshPassengers}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>

        {!currentRide && driverStatus.isOnline && !rideStatus && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Your location: {driverLocation.address}</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'fare')}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="distance">Sort by Distance</option>
                <option value="fare">Sort by Fare</option>
              </select>
            </div>

            <button
              onClick={handleStartSearching}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Find Passengers</span>
            </button>
            
            {sortedPassengers.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Available Passengers</h3>
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {sortedPassengers.map((passenger) => (
                    <div
                      key={passenger.id}
                      className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => {
                        setCurrentRide(passenger);
                        setRideStatus('found');
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{passenger.name}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-gray-600 ml-1">{passenger.rating}</span>
                              </div>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-600">
                                {passenger.distanceFromDriver.toFixed(1)} km away
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-green-600">₹{passenger.fare}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <div>
                            <span className="text-gray-600">{passenger.pickup}</span>
                            <span className="text-gray-400 ml-2">
                              ({passenger.estimatedReachTime} mins to reach)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-gray-600">{passenger.dropoff}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Trip: {passenger.distance.toFixed(1)} km • {passenger.duration} mins
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentRide && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{currentRide.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{currentRide.rating}</span>
                  </div>
                </div>
              </div>
              {rideStatus === 'accepted' && (
                <a
                  href={`tel:${currentRide.phone}`}
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium">{currentRide.pickup}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Dropoff</p>
                  <p className="font-medium">{currentRide.dropoff}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{currentRide.distance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{currentRide.duration} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fare</p>
                <p className="font-medium">₹{currentRide.fare}</p>
              </div>
            </div>

            {rideStatus === 'found' && (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelRide}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptRide}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
              </div>
            )}

            {rideStatus === 'accepted' && (
              <button
                onClick={() => {
                  const otp = generateOtp();
                  console.log('Generated OTP:', otp); // For testing
                  setShowOtpModal(true);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Navigation className="w-5 h-5" />
                <span>Start Ride</span>
              </button>
            )}

            {rideStatus === 'in-progress' && currentRideStatus === 'started' && currentRide && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Ride in Progress</span>
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    <p>To: {currentRide.dropoff}</p>
                    <p>Distance: {currentRide.distance} km</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentRideStatus('completed');
                    setRideStatus('completed');
                    setDriverStatus(prev => ({
                      ...prev,
                      totalTripsToday: prev.totalTripsToday + 1,
                      totalEarningsToday: prev.totalEarningsToday + currentRide.fare
                    }));
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  End Ride
                </button>
              </div>
            )}

            {rideStatus === 'completed' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Ride Completed</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-semibold">₹{currentRide.fare}</p>
                    <p className="text-sm text-green-600">Added to your earnings</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentRide(null);
                    setRideStatus(null);
                    setCurrentRideStatus(null);
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Find New Ride
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
        <button
            onClick={() => setActiveTab('find-ride')}
          className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'find-ride'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
            Find Ride
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Ride History
        </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Profile
          </button>
      </div>
                <button
                  onClick={toggleOnlineStatus}
          className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                    driverStatus.isOnline
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
          <div className={`w-2 h-2 rounded-full ${driverStatus.isOnline ? 'bg-red-600' : 'bg-green-600'}`} />
          <span>{driverStatus.isOnline ? 'Go Offline' : 'Go Online'}</span>
                </button>
            </div>

      {activeTab === 'find-ride' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Find Ride</h2>
              </div>

              <RidesView />
            </div>
      )}

      {activeTab === 'history' && <RideHistory userType="driver" />}
      
      {activeTab === 'profile' && driverProfile && (
        <DriverProfile driverProfile={driverProfile} stats={stats} />
      )}

          {showOtpModal && <OtpVerificationModal />}
          {showEmergencyModal && <EmergencyModal onClose={() => setShowEmergencyModal(false)} />}
    </div>
  );
}

const EmergencyModal = ({ onClose }: { onClose: () => void }) => {
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between text-red-600 mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="text-xl font-bold">Emergency Assistance</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.open('tel:112')}
            className="w-full bg-red-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2"
          >
            <PhoneCall className="h-5 w-5" />
            <span>Call Police (112)</span>
          </button>

          <button
            onClick={() => window.open('tel:102')}
            className="w-full bg-red-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2"
          >
            <PhoneCall className="h-5 w-5" />
            <span>Call Ambulance (102)</span>
          </button>

          <button
            onClick={() => window.open('tel:+1234567890')}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2"
          >
            <Shield className="h-5 w-5" />
            <span>Contact SmartCab Support</span>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-4">Emergency Contacts:</p>
          <div className="space-y-2">
            {/* Add emergency contacts here */}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};