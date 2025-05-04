import React, { useState, useEffect } from 'react';
import { MapPin, Users, Car, DollarSign, Leaf, Clock, CreditCard, Navigation, Search, MessageCircle, Check, User, Star, Calendar, Phone, AlertTriangle, Ambulance, X, Accessibility, Settings, Edit2, Tag, Wallet, Shield, ChevronLeft } from 'lucide-react';
import { calculatePrice } from '../utils/pricing';
import type { CoPassenger, ChatMessage, Driver } from '../types';
import CoPassengerFinder from './CoPassengerFinder';
import ChatWindow from './ChatWindow';
import RideHistory from './RideHistory';
import PaymentPage from './PaymentPage';
import CouponModal from './CouponModal';
import Insurance from './Insurance';

interface Location {
  address: string;
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface VehicleType {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  capacity: number;
  basePrice: number;
  available: number;
  wheelchairAccessible: boolean;
}

interface FavoriteDriver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
  phone: string;
  lastRideDate: Date;
}

interface DisabilityAccommodation {
  wheelchairAccess: boolean;
  visualAssistance: boolean;
  hearingAssistance: boolean;
  mobilityAid: boolean;
  serviceAnimal: boolean;
  specialInstructions: string;
}

interface BackupDriver extends Driver {
  sequence: number;
  status: 'active' | 'standby' | 'cancelled';
}

interface MembershipPlan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  discount: number; // percentage
  benefits: string[];
  isPopular?: boolean;
}

interface RiderProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  emergencyContact: string;
  preferredPayment: string;
  address: string;
  totalRides: number;
  memberSince: Date;
  rating: number;
  membership?: {
    planId: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface RidePayment {
  id: string;
  amount: number;
  status: 'pending' | 'completed';
  method: string;
  timestamp: Date;
}

const mockDriver: Driver = {
  id: "d1",
  name: "Rajesh Kumar",
  rating: 4.8,
  vehicle: "Honda City",
  licensePlate: "DL 01 AB 1234",
  phone: "+91 98765 43210",
  isAvailable: true,
  location: { lat: 28.6139, lng: 77.2090 }
};

const mockBackupDrivers: BackupDriver[] = [
  {
    id: "d1",
    name: "Rajesh Kumar",
    rating: 4.8,
    vehicle: "Honda City",
    licensePlate: "DL 01 AB 1234",
    phone: "+91 98765 43210",
    isAvailable: true,
    location: { lat: 28.6139, lng: 77.2090 },
    sequence: 1,
    status: 'active'
  },
  {
    id: "d2",
    name: "Amit Singh",
    rating: 4.9,
    vehicle: "Toyota Innova",
    licensePlate: "DL 02 CD 5678",
    phone: "+91 98765 43211",
    isAvailable: true,
    location: { lat: 28.6140, lng: 77.2091 },
    sequence: 2,
    status: 'standby'
  },
  {
    id: "d3",
    name: "Suresh Patel",
    rating: 4.7,
    vehicle: "Maruti Swift",
    licensePlate: "DL 03 EF 9012",
    phone: "+91 98765 43212",
    isAvailable: true,
    location: { lat: 28.6141, lng: 77.2092 },
    sequence: 3,
    status: 'standby'
  }
];

const rideOptions = [
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Comfortable sedan for up to 4 passengers',
    capacity: 4,
    multiplier: 1.0,
    icon: <Car className="w-6 h-6" />
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury vehicle for a premium experience',
    capacity: 4,
    multiplier: 1.5,
    icon: <Car className="w-6 h-6" />
  }
];

const vehicleTypes: VehicleType[] = [
  {
    id: 'auto',
    name: 'Auto',
    icon: <Car className="w-6 h-6" />,
    description: 'Affordable 3-wheeler for short trips',
    capacity: 3,
    basePrice: 15,
    available: 5,
    wheelchairAccessible: false
  },
  {
    id: 'mini',
    name: 'Mini',
    icon: <Car className="w-6 h-6" />,
    description: 'Compact cars for city rides',
    capacity: 4,
    basePrice: 20,
    available: 8,
    wheelchairAccessible: false
  },
  {
    id: 'sedan',
    name: 'Sedan',
    icon: <Car className="w-6 h-6" />,
    description: 'Comfortable sedan for up to 4 people',
    capacity: 4,
    basePrice: 25,
    available: 6,
    wheelchairAccessible: false
  },
  {
    id: 'wheelchair_accessible',
    name: 'Wheelchair Accessible',
    icon: <Accessibility className="w-6 h-6" />,
    description: 'Specially equipped vehicle with wheelchair ramp',
    capacity: 4,
    basePrice: 30,
    available: 3,
    wheelchairAccessible: true
  },
  {
    id: 'suv',
    name: 'SUV',
    icon: <Car className="w-6 h-6" />,
    description: 'Spacious SUV for group travel',
    capacity: 6,
    basePrice: 35,
    available: 4,
    wheelchairAccessible: false
  }
];

const mockFavoriteDrivers: FavoriteDriver[] = [
  {
    id: "d1",
    name: "Rajesh Kumar",
    rating: 4.8,
    vehicle: "Honda City",
    licensePlate: "DL 01 AB 1234",
    phone: "+91 98765 43210",
    lastRideDate: new Date(2024, 2, 15)
  },
  {
    id: "d2",
    name: "Amit Singh",
    rating: 4.9,
    vehicle: "Toyota Innova",
    licensePlate: "DL 02 CD 5678",
    phone: "+91 98765 43211",
    lastRideDate: new Date(2024, 2, 18)
  },
  {
    id: "d3",
    name: "Pradeep Sharma",
    rating: 4.7,
    vehicle: "Hyundai Verna",
    licensePlate: "DL 03 EF 9012",
    phone: "+91 98765 43212",
    lastRideDate: new Date(2024, 2, 20)
  }
];

const mockRiderProfile: RiderProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  gender: "Male",
  emergencyContact: "+91 98765 43211",
  preferredPayment: "Credit Card",
  address: "123 Main Street, New Delhi",
  totalRides: 45,
  memberSince: new Date(2023, 5, 15),
  rating: 4.8,
  membership: {
    planId: 'monthly',
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 3, 1),
    isActive: true
  }
};

const membershipPlans: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Pro',
    duration: 1,
    price: 299,
    discount: 15,
    benefits: [
      '15% off on all rides',
      'Priority driver allocation',
      'Free cancellation',
      '24/7 customer support'
    ]
  },
  {
    id: 'half-yearly',
    name: '6 Months Premium',
    duration: 6,
    price: 1499,
    discount: 25,
    benefits: [
      '25% off on all rides',
      'Priority driver allocation',
      'Free cancellation',
      '24/7 customer support',
      'Airport pickup privileges',
      'Dedicated customer care'
    ],
    isPopular: true
  },
  {
    id: 'yearly',
    name: 'Annual Ultimate',
    duration: 12,
    price: 2499,
    discount: 35,
    benefits: [
      '35% off on all rides',
      'Priority driver allocation',
      'Free cancellation',
      '24/7 customer support',
      'Airport pickup privileges',
      'Dedicated customer care',
      'Free intercity rides (2/month)',
      'Family account sharing'
    ]
  }
];

export default function RideBooking() {
  const [activeTab, setActiveTab] = useState<'booking' | 'history' | 'profile' | 'payment'>('booking');
  const [pickup, setPickup] = useState<Location>({ address: '' });
  const [dropoff, setDropoff] = useState<Location>({ address: '' });
  const [isShared, setIsShared] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('comfort');
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [showGenderSelect, setShowGenderSelect] = useState(false);
  const [searchingCoPassenger, setSearchingCoPassenger] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(false);
  const [coPassenger, setCoPassenger] = useState<CoPassenger | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [bookingStep, setBookingStep] = useState<'initial' | 'finding' | 'driver-search' | 'confirmed' | 'driver-cancelled' | 'reallocated'>('initial');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);
  const [showDriverChat, setShowDriverChat] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('mini');
  const [cancellationReason, setCancellationReason] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [favoriteDrivers, setFavoriteDrivers] = useState<FavoriteDriver[]>(mockFavoriteDrivers);
  const [showFavoriteDrivers, setShowFavoriteDrivers] = useState(false);
  const [requestingFavoriteDriver, setRequestingFavoriteDriver] = useState<string | null>(null);
  const [hasDisability, setHasDisability] = useState(false);
  const [disabilityAccommodations, setDisabilityAccommodations] = useState<DisabilityAccommodation>({
    wheelchairAccess: false,
    visualAssistance: false,
    hearingAssistance: false,
    mobilityAid: false,
    serviceAnimal: false,
    specialInstructions: ''
  });
  const [backupDrivers, setBackupDrivers] = useState<BackupDriver[]>([]);
  const [riderProfile, setRiderProfile] = useState<RiderProfile>(mockRiderProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [ridePayment, setRidePayment] = useState<RidePayment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInsuranceSection, setShowInsuranceSection] = useState(false);
  const [isInsuranceSelected, setIsInsuranceSelected] = useState(false);
  const INSURANCE_PRICE = 5; // 5 Rs per ride for insurance

  useEffect(() => {
    if (pickup.address && dropoff.address) {
      // Simulate distance calculation
      setTimeout(() => {
        const calculatedDistance = Math.random() * 10 + 5; // Random distance between 5-15 km
        const calculatedDuration = calculatedDistance * 3; // Rough estimate: 3 minutes per km
        setDistance(calculatedDistance);
        setDuration(calculatedDuration);
        setShowLocationSearch(true);
      }, 1000);
    }
  }, [pickup.address, dropoff.address]);

  const handleShareRideToggle = (enabled: boolean) => {
    setIsShared(enabled);
    if (enabled) {
      // Reset co-passenger state when enabling share ride
      setCoPassenger(null);
      setSearchingCoPassenger(false);
      setShowGenderSelect(true);
      setBookingStep('initial');
    }
  };

  const handleFindCoPassenger = () => {
    if (!pickup.address || !dropoff.address) {
      alert('Please enter pickup and dropoff locations');
      return;
    }

    setSearchingCoPassenger(true);
    setBookingStep('finding');

    // Simulate finding a co-passenger with more realistic timing and states
    setTimeout(() => {
      const mockCoPassengers: CoPassenger[] = [
        {
        id: '1',
        name: gender === 'male' ? 'Rahul Singh' : 'Priya Sharma',
        gender: gender,
        rating: 4.8,
          pickupLocation: 'Near ' + pickup.address,
          dropoffLocation: 'Near ' + dropoff.address,
          distance: distance || 0,
          profilePic: null
        },
        {
          id: '2',
          name: gender === 'male' ? 'Amit Kumar' : 'Neha Verma',
          gender: gender,
          rating: 4.9,
          pickupLocation: 'Near ' + pickup.address,
          dropoffLocation: 'Near ' + dropoff.address,
          distance: distance || 0,
          profilePic: null
        }
      ];

      setCoPassenger(mockCoPassengers[Math.floor(Math.random() * mockCoPassengers.length)]);
      setSearchingCoPassenger(false);
    }, 3000);
  };

  const handleFindDriver = () => {
    setSearchingDriver(true);
    setBookingStep('driver-search');
    // Simulate finding a driver after 40 seconds
    setTimeout(() => {
      setDriver(mockDriver);
      setSearchingDriver(false);
      setBookingStep('confirmed');
    }, 40000);
  };

  const handleConfirmCoPassenger = () => {
    // After confirming co-passenger, proceed to find driver
    setBookingStep('driver-search');
    setSearchingDriver(true);

    // Simulate finding a driver after confirming co-passenger
    setTimeout(() => {
      setDriver(mockDriver);
      setSearchingDriver(false);
      setBookingStep('confirmed');
    }, 5000);
  };

  const handleBookNow = () => {
    if (!pickup.address || !dropoff.address) {
      alert('Please enter pickup and dropoff locations');
      return;
    }

    if (!selectedVehicle) {
      alert('Please select a vehicle type');
      return;
    }

    // Calculate final price with insurance if selected
    const basePrice = price || 0;
    const discountedPrice = calculateDiscountedPrice(basePrice);
    const totalPriceWithInsurance = discountedPrice + (isInsuranceSelected ? INSURANCE_PRICE : 0);

    if (isShared) {
      // For shared rides, start with finding co-passenger
      handleFindCoPassenger();
    } else if (isScheduled) {
      // For scheduled rides, set up all three backup drivers
      setBackupDrivers(mockBackupDrivers);
      setDriver(mockBackupDrivers[0]);
      setBookingStep('confirmed');
      
      // Set the first driver as active and others as standby
      const updatedBackupDrivers = mockBackupDrivers.map((driver, index) => ({
        ...driver,
        status: index === 0 ? 'active' : 'standby'
      }));
      setBackupDrivers(updatedBackupDrivers);
    } else {
      // For immediate solo rides
      handleFindDriver();
    }
  };

  const price = distance && duration ? calculatePrice({
    distance,
    duration,
    isShared,
    vehicleType: selectedVehicle,
    demandMultiplier: 1.0
  }) : null;

  const finalPrice = price ? (isInsuranceSelected ? price + INSURANCE_PRICE : price) : null;
  
  const emissionsSaved = isShared && distance ? (distance * 0.5) : 0;

  const handleCancelRide = () => {
    setShowCancelModal(true);
  };

  const confirmCancelRide = () => {
    if (!cancellationReason) {
      alert('Please select a reason for cancellation');
      return;
    }

    if (isScheduled) {
      const currentDriver = backupDrivers.find(d => d.status === 'active');
      if (currentDriver) {
        // Mark current driver as cancelled
        setBackupDrivers(prev => prev.map(d => 
          d.id === currentDriver.id 
            ? { ...d, status: 'cancelled' }
            : d
        ));

        // Find next available driver
        const nextDriver = backupDrivers.find(d => d.status === 'standby');
        if (nextDriver) {
          // Show cancellation message
          setShowCancelModal(false);
          setBookingStep('driver-cancelled');

          // After 2 seconds, switch to next driver
          setTimeout(() => {
            setBackupDrivers(prev => prev.map(d => 
              d.id === nextDriver.id 
                ? { ...d, status: 'active' }
                : d
            ));
            setDriver(nextDriver);
            setBookingStep('reallocated');

            // After 3 seconds, return to confirmed state
            setTimeout(() => {
              setBookingStep('confirmed');
            }, 3000);
          }, 2000);
        } else {
          // No more backup drivers available
          alert('No more drivers available. Booking cancelled.');
          setBookingStep('initial');
          setDriver(null);
          setBackupDrivers([]);
        }
      }
    } else {
      // Handle normal ride cancellation
      setBookingStep('initial');
      setDriver(null);
      setShowCancelModal(false);
      setCancellationReason('');
      alert('Ride cancelled successfully');
    }
  };

  const handleAddToFavorites = () => {
    if (driver) {
      const newFavoriteDriver: FavoriteDriver = {
        id: driver.id,
        name: driver.name,
        rating: driver.rating,
        vehicle: driver.vehicle,
        licensePlate: driver.licensePlate,
        phone: driver.phone,
        lastRideDate: new Date()
      };

      setFavoriteDrivers(prev => {
        // Check if driver is already in favorites
        if (!prev.find(d => d.id === driver.id)) {
          return [...prev, newFavoriteDriver];
        }
        return prev;
      });
      alert('Driver added to favorites!');
    }
  };

  const requestRideFromFavorite = (favoriteDriver: FavoriteDriver) => {
    setRequestingFavoriteDriver(favoriteDriver.id);
    
    // Simulate driver receiving request and accepting/declining
    setTimeout(() => {
      const driverAccepts = Math.random() > 0.3; // 70% chance of accepting
      
      if (driverAccepts) {
        setDriver({
          ...favoriteDriver,
          isAvailable: true,
          location: { lat: 0, lng: 0 }
        });
        setBookingStep('confirmed');
        alert(`${favoriteDriver.name} accepted your ride request!`);
      } else {
        alert(`${favoriteDriver.name} is currently unavailable. Try booking with another driver.`);
      }
      setRequestingFavoriteDriver(null);
      setShowFavoriteDrivers(false);
    }, 3000);
  };

  const FavoriteDriversList = () => (
    <div className="space-y-4">
      {favoriteDrivers.length === 0 ? (
        <p className="text-gray-500 text-center py-4">You haven't added any drivers to favorites yet.</p>
      ) : (
        favoriteDrivers.map(fav => (
          <div key={fav.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{fav.name}</h4>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{fav.rating}</span>
                </div>
                <p className="text-sm text-gray-500">{fav.vehicle} • {fav.licensePlate}</p>
                <p className="text-xs text-gray-400">Last ride: {fav.lastRideDate.toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => requestRideFromFavorite(fav)}
                disabled={requestingFavoriteDriver !== null}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  requestingFavoriteDriver === fav.id
                    ? 'bg-blue-100 text-blue-600'
                    : requestingFavoriteDriver !== null
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {requestingFavoriteDriver === fav.id ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Requesting...</span>
                  </>
                ) : (
                  <>
                    <Car className="w-5 h-5" />
                    <span>Request Ride</span>
                  </>
                )}
              </button>
            </div>
            {requestingFavoriteDriver === fav.id && (
              <div className="mt-3 text-sm text-blue-600">
                Sending ride request to {fav.name}...
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  // Vehicles filtering based on disability accommodation
  const filteredVehicleTypes = hasDisability && disabilityAccommodations.wheelchairAccess
    ? vehicleTypes.filter(vehicle => vehicle.wheelchairAccessible)
    : vehicleTypes;

  // Check if wheelchair accessible vehicles are available
  const wheelchairVehiclesAvailable = filteredVehicleTypes.some(vehicle => vehicle.wheelchairAccessible);
  
  // If user selected wheelchair access but no accessible vehicles are available
  const showWheelchairWarning = hasDisability && 
    disabilityAccommodations.wheelchairAccess && 
    !wheelchairVehiclesAvailable;

  const BackupDriversStatus = () => (
    <div className="mt-4 space-y-3">
      <h4 className="font-medium text-gray-800">Backup Drivers</h4>
      <div className="space-y-2">
        {backupDrivers.map((backupDriver) => (
          <div 
            key={backupDriver.id}
            className={`p-3 rounded-lg border ${
              backupDriver.status === 'active' 
                ? 'bg-green-50 border-green-200'
                : backupDriver.status === 'standby'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <User className={`w-5 h-5 ${
                    backupDriver.status === 'active' 
                      ? 'text-green-600'
                      : backupDriver.status === 'standby'
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium">{backupDriver.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{backupDriver.rating}</span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                backupDriver.status === 'active' 
                  ? 'text-green-600'
                  : backupDriver.status === 'standby'
                  ? 'text-blue-600'
                  : 'text-red-600'
              }`}>
                {backupDriver.status === 'active' 
                  ? 'Current Driver'
                  : backupDriver.status === 'standby'
                  ? `Backup #${backupDriver.sequence}`
                  : 'Cancelled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleProfileUpdate = (updatedProfile: Partial<RiderProfile>) => {
    setRiderProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
    setIsEditingProfile(false);
  };

  const handleSubscribe = (planId: string) => {
    const plan = membershipPlans.find(p => p.id === planId);
    if (!plan) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    setRiderProfile(prev => ({
      ...prev,
      membership: {
        planId: plan.id,
        startDate,
        endDate,
        isActive: true
      }
    }));
    setShowMembershipModal(false);
    alert(`Successfully subscribed to ${plan.name}!`);
  };

  const handleApplyCoupon = (coupon: any) => {
    setAppliedCoupon({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const calculateDiscountedPrice = (price: number) => {
    if (!appliedCoupon) return price;
    
    if (appliedCoupon.type === 'percentage') {
      return price * (1 - appliedCoupon.discount / 100);
    } else {
      return Math.max(0, price - appliedCoupon.discount);
    }
  };

  const renderPriceSection = () => {
    const basePrice = price || 0;
    const discountedPrice = calculateDiscountedPrice(basePrice);
    const discountAmount = basePrice - discountedPrice;
    const insuranceAmount = isInsuranceSelected ? INSURANCE_PRICE : 0;
    const totalPrice = Math.round(discountedPrice) + insuranceAmount;

    return (
      <div className="border-t pt-4">
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Estimated Price</p>
                <p className="text-2xl font-semibold">₹{totalPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{distance?.toFixed(1)} km</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Duration: ~{Math.round(duration || 0)} mins</p>
              {isShared && <p className="text-green-600">40% off on shared ride</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600">Applied: {appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
              {discountAmount > 0 && (
                <p className="text-green-600">
                  You saved ₹{Math.round(discountAmount)}
                </p>
              )}
              
              {/* Insurance Option */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="insurance-checkbox"
                    checked={isInsuranceSelected}
                    onChange={(e) => setIsInsuranceSelected(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="insurance-checkbox" className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Ride Insurance</span>
                  </label>
                </div>
                <span className="font-medium text-blue-600">₹{INSURANCE_PRICE}</span>
              </div>
              {isInsuranceSelected && (
                <p className="text-xs text-gray-500 mt-1 pl-6">Basic coverage for your journey</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
          <button
            onClick={() => setShowCouponModal(true)}
            className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Tag className="w-5 h-5" />
            <span>Apply Coupon</span>
          </button>

            <button
              onClick={() => setShowFavoriteDrivers(true)}
              className="w-full bg-yellow-50 text-yellow-700 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>Book with Favorite Driver</span>
            </button>
          </div>

          {isShared ? (
            <div className="space-y-3">
              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Find Co-Passenger</span>
              </button>
              <button
                onClick={() => {
                  setIsShared(false);
                  handleBookNow();
                }}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Book Without Sharing • ₹{Math.round((finalPrice || 0) * 1.67)}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Book Now • ₹{finalPrice}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleStartRide = () => {
    setRideStarted(true);
    // Initialize payment details when ride starts
    const basePrice = price || 0;
    const discountedPrice = calculateDiscountedPrice(basePrice);
    const totalPrice = discountedPrice + (isInsuranceSelected ? INSURANCE_PRICE : 0);

    setRidePayment({
      id: Date.now().toString(),
      amount: totalPrice,
      status: 'pending',
      method: '',
      timestamp: new Date()
    });
  };

  const handleCompletePayment = (paymentMethod: string) => {
    if (ridePayment) {
      setRidePayment({
        ...ridePayment,
        status: 'completed',
        method: paymentMethod,
        timestamp: new Date()
      });
      setShowPaymentModal(false);
      alert('Payment completed successfully!');

      // Reset all booking-related states
      setPickup({ address: '' });
      setDropoff({ address: '' });
      setIsShared(false);
      setSelectedOption('comfort');
      setDistance(null);
      setDuration(null);
      setGender('male');
      setShowGenderSelect(false);
      setSearchingCoPassenger(false);
      setSearchingDriver(false);
      setCoPassenger(null);
      setDriver(null);
      setShowChat(false);
      setBookingStep('initial');
      setIsScheduled(false);
      setScheduledTime('');
      setScheduledDate('');
      setShowLocationSearch(false);
      setRideStarted(false);
      setShowDriverChat(false);
      setSelectedVehicle('mini');
      setCancellationReason('');
      setShowCancelModal(false);
      setBackupDrivers([]);
      setAppliedCoupon(null);
      setRidePayment(null);
      setIsInsuranceSelected(false);
      setHasDisability(false);
      setDisabilityAccommodations({
        wheelchairAccess: false,
        visualAssistance: false,
        hearingAssistance: false,
        mobilityAid: false,
        serviceAnimal: false,
        specialInstructions: ''
      });
    }
  };

  const renderRideInProgress = () => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-green-600">
          <Check className="w-5 h-5" />
          <span className="font-medium">Ride in Progress</span>
        </div>
        <p className="text-sm text-green-600 mt-1">Have a safe journey!</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Distance</p>
          <p className="font-medium">{distance?.toFixed(1)} km</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Est. Duration</p>
          <p className="font-medium">{Math.round(duration || 0)} mins</p>
        </div>
      </div>

      {ridePayment && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Payment Details</h4>
            {ridePayment.status === 'pending' ? (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                Pending
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                Paid
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">₹{ridePayment.amount}</span>
            </div>
            {ridePayment.status === 'completed' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">{ridePayment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid At</span>
                  <span className="font-medium">
                    {ridePayment.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {ridePayment.status === 'pending' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pay Now</span>
            </button>
          )}
        </div>
      )}

      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-600">Emergency</span>
          </div>
          <button
            onClick={() => {
              alert('Emergency services have been notified. Stay calm.');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            SOS
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToFavorites}
        className="w-full bg-yellow-100 text-yellow-600 py-3 rounded-lg font-semibold hover:bg-yellow-200 transition-colors flex items-center justify-center space-x-2"
      >
        <Star className="w-5 h-5" />
        <span>Add Driver to Favorites</span>
      </button>
    </div>
  );

  // Add Payment Modal
  const renderPaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Complete Payment</h3>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-semibold">₹{ridePayment?.amount}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleCompletePayment('Credit Card')}
              className="w-full flex items-center space-x-3 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
            >
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span>Pay with Credit Card</span>
            </button>
            <button
              onClick={() => handleCompletePayment('Debit Card')}
              className="w-full flex items-center space-x-3 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
            >
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span>Pay with Debit Card</span>
            </button>
            <button
              onClick={() => handleCompletePayment('UPI')}
              className="w-full flex items-center space-x-3 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
            >
              <Wallet className="w-6 h-6 text-blue-600" />
              <span>Pay with UPI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (showInsuranceSection) {
      return (
        <div className="p-6">
          <button 
            onClick={() => setShowInsuranceSection(false)}
            className="mb-4 flex items-center text-blue-600"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Profile
          </button>
          <h2 className="text-xl font-semibold mb-4">Insurance has been moved</h2>
          <p className="text-gray-600">
            Insurance is now available as an option during ride booking.
            You can select insurance coverage when booking your next ride!
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          <div className="flex space-x-2">
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Rest of profile content remains the same */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{riderProfile.name}</h3>
              <div className="flex items-center space-x-2 text-gray-600">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{riderProfile.rating} Rating</span>
                <span>•</span>
                <span>{riderProfile.totalRides} Rides</span>
              </div>
              <p className="text-sm text-gray-500">Member since {riderProfile.memberSince.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{riderProfile.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{riderProfile.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Gender</label>
                <p className="font-medium">{riderProfile.gender}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Emergency Contact</label>
                <p className="font-medium">{riderProfile.emergencyContact}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Preferred Payment</label>
                <p className="font-medium">{riderProfile.preferredPayment}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{riderProfile.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{riderProfile.totalRides}</p>
              <p className="text-sm text-gray-600">Total Rides</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{riderProfile.rating}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.floor((new Date().getTime() - riderProfile.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30))}
              </p>
              <p className="text-sm text-gray-600">Months Active</p>
            </div>
          </div>

          {!isEditingProfile && (
            <>
              <div className="border-t mt-6 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Membership Status</h3>
                  <button
                    onClick={() => setShowMembershipModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>{riderProfile.membership?.isActive ? 'Upgrade Plan' : 'Get Membership'}</span>
                  </button>
                </div>

                {riderProfile.membership?.isActive ? (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-purple-800">
                          {membershipPlans.find(p => p.id === riderProfile.membership?.planId)?.name}
                        </h4>
                        <p className="text-sm text-purple-600 mt-1">
                          Valid till: {riderProfile.membership.endDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-full text-purple-600 text-sm font-medium">
                        Active
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-purple-700">
                      <p>Discount: {membershipPlans.find(p => p.id === riderProfile.membership?.planId)?.discount}% off on all rides</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600">No active membership. Subscribe to get exclusive discounts!</p>
                  </div>
                )}
              </div>

              {showMembershipModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Choose Your Membership Plan</h3>
                      <button
                        onClick={() => setShowMembershipModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {membershipPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`relative rounded-lg border-2 ${
                            plan.isPopular
                              ? 'border-purple-600 shadow-lg'
                              : 'border-gray-200'
                          } p-6 transition-all hover:shadow-lg`}
                        >
                          {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                                Most Popular
                              </div>
                            </div>
                          )}

                          <div className="text-center mb-6">
                            <h4 className="text-xl font-semibold text-gray-800">{plan.name}</h4>
                            <div className="mt-4">
                              <span className="text-4xl font-bold">₹{plan.price}</span>
                              <span className="text-gray-500">/{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
                            </div>
                            <p className="text-purple-600 font-semibold mt-2">{plan.discount}% off on all rides</p>
                          </div>

                          <ul className="space-y-3 mb-6">
                            {plan.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center text-gray-600">
                                <Check className="w-5 h-5 text-green-500 mr-2" />
                                <span className="text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                              plan.isPopular
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            Subscribe Now
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Membership Benefits</h4>
                      <ul className="grid grid-cols-2 gap-3 text-sm text-blue-600">
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          Exclusive ride discounts
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          Priority driver allocation
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          24/7 premium support
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          Special event offers
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Auto-select wheelchair accessible vehicle when needed
  useEffect(() => {
    // If the user needs wheelchair access and there's only one accessible vehicle
    if (hasDisability && disabilityAccommodations.wheelchairAccess) {
      const accessibleVehicles = vehicleTypes.filter(v => v.wheelchairAccessible);
      
      // Auto-select the wheelchair accessible vehicle if there's only one or if the current selection isn't accessible
      if (accessibleVehicles.length > 0) {
        const currentVehicleIsAccessible = accessibleVehicles.some(v => v.id === selectedVehicle);
        
        if (!currentVehicleIsAccessible || accessibleVehicles.length === 1) {
          setSelectedVehicle(accessibleVehicles[0].id);
        }
      }
    }
  }, [hasDisability, disabilityAccommodations.wheelchairAccess]);

  // Add CoPassengerFinder component update
  const CoPassengerFinder = ({ searching, coPassenger, onConfirm, onChat }: any) => (
    <div className="space-y-4">
      {searching ? (
        <div className="text-center p-6">
          <div className="animate-spin w-12 h-12 mx-auto mb-4">
            <Users className="w-full h-full text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Finding Co-Passenger</h3>
          <p className="text-gray-600">Looking for someone heading in the same direction...</p>
        </div>
      ) : coPassenger ? (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{coPassenger.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">{coPassenger.rating}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onChat}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <p>Pickup: {coPassenger.pickupLocation}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <p>Drop-off: {coPassenger.dropoffLocation}</p>
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => handleFindCoPassenger()}
              className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Find Another
            </button>
            <button
              onClick={() => handleConfirmCoPassenger()}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirm Co-Passenger
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <X className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Co-Passengers Found</h3>
          <p className="text-gray-600 mb-4">We couldn't find anyone sharing your route right now.</p>
          <div className="space-x-3">
            <button
              onClick={() => handleFindCoPassenger()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setIsShared(false);
                handleBookNow();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Book Solo Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Update the gender selection modal
  const renderGenderSelectModal = () => (
    showGenderSelect && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Select Your Gender</h3>
          <p className="text-gray-600 mb-4">This helps us match you with appropriate co-passengers.</p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setGender('male');
                setShowGenderSelect(false);
              }}
              className={`w-full p-3 rounded-lg border ${
                gender === 'male' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => {
                setGender('female');
                setShowGenderSelect(false);
              }}
              className={`w-full p-3 rounded-lg border ${
                gender === 'female' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="border-b">
        <div className="flex justify-center space-x-4 p-4">
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'booking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Book a Ride
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
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'payment'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Payment
        </button>
        </div>
      </div>

      <div className="p-6">
      {activeTab === 'booking' ? (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Pickup Location"
                  value={pickup.address}
                  onChange={(e) => setPickup({ address: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                    placeholder="Drop-off Location"
                  value={dropoff.address}
                  onChange={(e) => setDropoff({ address: e.target.value })}
                  className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

                {/* Accessibility Options */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Accessibility className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Need Special Assistance?</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hasDisability}
                      onChange={(e) => setHasDisability(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {hasDisability && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 border border-blue-100">
                        <input
                          type="checkbox"
                          checked={disabilityAccommodations.wheelchairAccess}
                          onChange={(e) => setDisabilityAccommodations(prev => ({
                            ...prev,
                            wheelchairAccess: e.target.checked
                          }))}
                          className="rounded text-blue-600"
                        />
                        <span className="text-blue-800">Wheelchair Access</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 border border-blue-100">
                        <input
                          type="checkbox"
                          checked={disabilityAccommodations.visualAssistance}
                          onChange={(e) => setDisabilityAccommodations(prev => ({
                            ...prev,
                            visualAssistance: e.target.checked
                          }))}
                          className="rounded text-blue-600"
                        />
                        <span className="text-blue-800">Visual Assistance</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 border border-blue-100">
                        <input
                          type="checkbox"
                          checked={disabilityAccommodations.hearingAssistance}
                          onChange={(e) => setDisabilityAccommodations(prev => ({
                            ...prev,
                            hearingAssistance: e.target.checked
                          }))}
                          className="rounded text-blue-600"
                        />
                        <span className="text-blue-800">Hearing Assistance</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 border border-blue-100">
                        <input
                          type="checkbox"
                          checked={disabilityAccommodations.mobilityAid}
                          onChange={(e) => setDisabilityAccommodations(prev => ({
                            ...prev,
                            mobilityAid: e.target.checked
                          }))}
                          className="rounded text-blue-600"
                        />
                        <span className="text-blue-800">Mobility Aid</span>
                      </label>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Special Instructions for Driver
                      </label>
                      <textarea
                        value={disabilityAccommodations.specialInstructions}
                        onChange={(e) => setDisabilityAccommodations(prev => ({
                          ...prev,
                          specialInstructions: e.target.value
                        }))}
                        placeholder="Any specific requirements or instructions for the driver..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
                </div>
              </div>

              {/* Map Preview */}
              {showLocationSearch && (
                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80"
                    alt="Map Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <p className="text-white text-sm">
                      Distance: {distance?.toFixed(1)} km • Duration: {duration?.toFixed(0)} mins
                    </p>
                  </div>
                </div>
              )}

              {/* Schedule Ride Option */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-600" size={20} />
                <span className="flex-1">Schedule for Later</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {isScheduled && (
                <div className="space-y-3">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Vehicle Selection */}
          {showLocationSearch && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Vehicle Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredVehicleTypes.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                        className={`p-4 border rounded-lg flex items-start space-x-3 ${
                        selectedVehicle === vehicle.id
                          ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-gray-300'
                      } ${hasDisability && vehicle.wheelchairAccessible ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      {hasDisability && vehicle.wheelchairAccessible && (
                        <div className="absolute -top-2 -right-2">
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                      )}
                        <div className="flex-shrink-0">
                          {vehicle.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{vehicle.name}</h4>
                          <p className="text-sm text-gray-500">{vehicle.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium">₹{vehicle.basePrice}/km</span>
                            <span className="text-sm text-gray-500">{vehicle.available} available</span>
                          </div>
                      </div>
                    </button>
                  ))}
                    </div>
                  </div>
                )}

              {/* Share Ride Option */}
              {showLocationSearch && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="text-gray-600" size={20} />
                    <span className="flex-1">Share Ride ( upto 50% off)</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isShared}
                        onChange={(e) => handleShareRideToggle(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {isShared && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Ride Sharing Benefits</h4>
                      <ul className="space-y-2 text-sm text-blue-600">
                        <li>• Save 50% on your fare</li>
                        <li>• Reduce CO₂ emissions</li>
                        <li>• Gender-matched co-passengers</li>
                        <li>• In-app chat for coordination</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Price Section */}
              {distance && duration && price && renderPriceSection()}

              {/* Booking Steps */}
              {bookingStep === 'finding' && (
                <CoPassengerFinder
                  searching={searchingCoPassenger}
                  coPassenger={coPassenger}
                  onConfirm={handleBookNow}
                  onChat={() => setShowChat(true)}
                />
              )}

              {bookingStep === 'driver-search' && (
                <div className="p-6 text-center">
                  <div className="animate-spin w-12 h-12 mx-auto mb-4">
                    <Clock className="w-full h-full text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Finding your driver</h3>
                  <p className="text-gray-600">Please wait while we connect you with a nearby driver...</p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}

              {bookingStep === 'confirmed' && driver && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {rideStarted ? 'Ride in Progress' : 'Ride Confirmed!'}
                    </h3>
                    {isScheduled ? (
                      <p className="text-gray-600">Scheduled for {scheduledDate} at {scheduledTime}</p>
                    ) : (
                      <p className="text-gray-600">
                        {rideStarted ? 'Have a safe journey!' : 'Your driver will arrive in 3 minutes'}
                      </p>
                    )}
                  </div>

                  {/* Driver Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{driver.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-600">{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`tel:${driver.phone}`}
                          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => setShowDriverChat(true)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Vehicle: {driver.vehicle}</p>
                      <p>License Plate: {driver.licensePlate}</p>
                      <p>Phone: {driver.phone}</p>
                    </div>
                  </div>

                  {/* Show Backup Drivers for scheduled rides */}
                  {isScheduled && backupDrivers.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-medium text-gray-800">Backup Drivers</h4>
                      <div className="space-y-2">
                        {backupDrivers.map((backupDriver) => (
                          <div 
                            key={backupDriver.id}
                            className={`p-3 rounded-lg border ${
                              backupDriver.status === 'active' 
                                ? 'bg-green-50 border-green-200'
                                : backupDriver.status === 'standby'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                  <User className={`w-5 h-5 ${
                                    backupDriver.status === 'active' 
                                      ? 'text-green-600'
                                      : backupDriver.status === 'standby'
                                      ? 'text-blue-600'
                                      : 'text-red-600'
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-medium">{backupDriver.name}</p>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm text-gray-600">{backupDriver.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <span className={`text-sm font-medium ${
                                backupDriver.status === 'active' 
                                  ? 'text-green-600'
                                  : backupDriver.status === 'standby'
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              }`}>
                                {backupDriver.status === 'active' 
                                  ? 'Current Driver'
                                  : backupDriver.status === 'standby'
                                  ? `Backup #${backupDriver.sequence}`
                                  : 'Cancelled'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!rideStarted ? (
                    <div className="space-y-3">
                      <button
                        onClick={handleStartRide}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Navigation className="w-5 h-5" />
                        <span>Start Ride</span>
                      </button>
                      
                      <button
                        onClick={handleCancelRide}
                        className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                      >
                        Cancel Ride
                      </button>
                    </div>
                  ) : (
                    renderRideInProgress()
                  )}
                      </div>
              )}
                          </div>
                            </div>
        ) : activeTab === 'history' ? (
          <RideHistory userType="rider" />
        ) : activeTab === 'payment' ? (
          <PaymentPage />
        ) : (
          <div className="max-w-2xl mx-auto">
            {renderProfile()}
                          </div>
        )}
                        </div>

      {/* Modals */}
      {showCouponModal && (
        <CouponModal
          onClose={() => setShowCouponModal(false)}
          onApply={(coupon) => {
            setAppliedCoupon(coupon);
            setShowCouponModal(false);
          }}
        />
      )}

      {showPaymentModal && ridePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
            <p className="text-gray-600 mb-4">Amount to pay: ₹{ridePayment.amount}</p>
            <div className="space-y-2">
              <button
                onClick={() => handleCompletePayment('card')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Pay with Card
              </button>
              <button
                onClick={() => handleCompletePayment('upi')}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Pay with UPI
              </button>
              <button
                onClick={() => handleCompletePayment('cash')}
                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Pay with Cash
              </button>
                        </div>
                      </div>
                    </div>
                  )}

      {/* Add this modal for favorite drivers */}
      {showFavoriteDrivers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Your Favorite Drivers</h3>
              <button
                onClick={() => setShowFavoriteDrivers(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <FavoriteDriversList />
          </div>
                </div>
              )}

      {/* Add this modal for ride cancellation */}
              {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Cancel Ride</h3>
                      <button
                        onClick={() => setShowCancelModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-600">Please select a reason for cancellation:</p>
                      <select
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select a reason</option>
                        <option value="wait_too_long">Driver is taking too long</option>
                        <option value="wrong_address">Wrong address entered</option>
                        <option value="changed_mind">Changed my mind</option>
                <option value="emergency">Emergency situation</option>
                        <option value="other">Other reason</option>
                      </select>

                      {cancellationReason === 'other' && (
                        <textarea
                          placeholder="Please specify your reason..."
                          className="w-full p-2 border rounded-lg"
                          rows={3}
                        />
                      )}

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowCancelModal(false)}
                          className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={confirmCancelRide}
                          disabled={!cancellationReason}
                          className={`flex-1 py-2 rounded-lg text-white transition-colors ${
                            cancellationReason
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Confirm Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

      {/* Add this modal for backup driver reallocation */}
              {bookingStep === 'driver-cancelled' && (
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Driver Cancelled</h3>
                    <p className="text-gray-600">Your scheduled ride was cancelled by the driver</p>
                    <div className="mt-4">
                      <div className="animate-spin w-8 h-8 mx-auto">
                        <Clock className="w-full h-full text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-600 mt-2">Finding new driver...</p>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 'reallocated' && (
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">New Driver Allocated!</h3>
                    <p className="text-gray-600">We've found a new driver for your scheduled ride</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{driver?.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">{driver?.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Vehicle: {driver?.vehicle}</p>
                      <p>License Plate: {driver?.licensePlate}</p>
                    </div>
                  </div>
                </div>
      )}
    </div>
  );
}