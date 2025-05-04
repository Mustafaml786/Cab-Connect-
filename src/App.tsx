import React, { useState } from 'react';
import { CarTaxiFront as Taxi, UserCircle } from 'lucide-react';
import RideBooking from './components/RideBooking';
import DriverDashboard from './components/DriverDashboard';
import AuthPage from './components/auth/AuthPage';
import HelpButton from './components/common/HelpButton';
import AdminDashboard from './components/admin/AdminDashboard';

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

interface User {
  email: string;
  name: string;
  userType: 'rider' | 'driver' | 'admin';
  isRegisteredDriver?: boolean;
  driverProfile?: DriverProfile;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleDriverRegistration = (driverData: DriverProfile) => {
    setUser(prev => prev ? {
      ...prev,
      isRegisteredDriver: driverData.status === 'approved',
      driverProfile: driverData
    } : null);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Taxi className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SmartCab</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircle className="h-8 w-8 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="text-sm text-gray-500">({user.userType})</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.userType === 'rider' ? (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <RideBooking />
            </div>
            <HelpButton userType="rider" />
          </div>
        ) : user.userType === 'driver' ? (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <DriverDashboard 
                isRegistered={user.isRegisteredDriver}
                driverProfile={user.driverProfile}
                onRegister={handleDriverRegistration}
              />
            </div>
            <HelpButton userType="driver" />
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;