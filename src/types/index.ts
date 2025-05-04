export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
  phone: string;
  isAvailable: boolean;
  location: Coordinates;
}

export interface Ride {
  id: string;
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  price: number;
  distance: number;
  duration: number;
  isShared: boolean;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PricingFactors {
  basePrice: number;
  distanceMultiplier: number;
  demandMultiplier: number;
  sharingDiscount: number;
}

export interface CoPassenger {
  id: string;
  name: string;
  gender: 'male' | 'female';
  rating: number;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}