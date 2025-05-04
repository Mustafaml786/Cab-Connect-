import React, { useState } from 'react';
import { CarTaxiFront as Taxi, Shield, UserCircle, LogIn, UserPlus, Star } from 'lucide-react';
import AuthForm from './AuthForm';

interface AuthPageProps {
  onLogin: (userData: any) => void;
}

interface AdminCredentials {
  email: string;
  password: string;
}

const mockDrivers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalRides: 150,
    vehicle: {
      model: 'Honda City',
      number: 'DL 01 AB 1234',
      type: 'Sedan'
    }
  },
  {
    id: '2',
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91 98765 43211',
    rating: 4.9,
    totalRides: 200,
    vehicle: {
      model: 'Toyota Innova',
      number: 'DL 02 CD 5678',
      type: 'SUV'
    }
  }
];

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'rider' | 'driver'>('rider');
  const [selectedType, setSelectedType] = useState<'rider' | 'driver' | 'admin' | null>(null);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    email: '',
    password: ''
  });
  const [showDriverOptions, setShowDriverOptions] = useState(false);
  const [isDriverApplication, setIsDriverApplication] = useState(false);

  const handleSubmit = (data: any) => {
    if (isDriverApplication) {
      // Handle driver application submission
      onLogin({
        ...data,
        userType: 'driver',
        isRegisteredDriver: false,
        driverProfile: {
          status: 'pending',
          personalInfo: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            aadharNo: '',
            address: ''
          },
          vehicleInfo: {
            licensePlate: '',
            vehicleModel: '',
            vehicleYear: '',
            insuranceNo: ''
          }
        }
      });
    } else if (selectedType === 'driver') {
      // For existing driver login
      onLogin({
        ...data,
        userType: 'driver',
        isRegisteredDriver: true,
        driverProfile: {
          status: 'approved',
          personalInfo: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            aadharNo: '1234 5678 9012',
            address: '123 Driver Street, New Delhi'
          },
          vehicleInfo: {
            licensePlate: 'DL 01 AB 1234',
            vehicleModel: 'Honda City',
            vehicleYear: '2022',
            insuranceNo: 'INS123456789'
          }
        }
      });
    } else {
      onLogin({ ...data, userType: selectedType || userType });
    }
  };

  const handleUserTypeSelect = (type: 'rider' | 'driver' | 'admin') => {
    setUserType(type as 'rider' | 'driver');
    setSelectedType(type);
    if (type === 'driver') {
      setShowDriverOptions(true);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically validate admin credentials
    if (adminCredentials.email === 'admin@smartcab.com' && adminCredentials.password === 'admin123') {
      onLogin({
        email: adminCredentials.email,
        name: 'Admin User',
        userType: 'admin'
      });
    } else {
      alert('Invalid admin credentials');
    }
  };

  const renderDriverOptions = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex items-center justify-center mb-6">
        <UserCircle className="h-8 w-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold">Driver Options</h2>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Existing Drivers</h3>
          <p className="text-sm text-blue-600 mb-4">Login with your existing driver account</p>
          <button
            onClick={() => {
              setShowDriverOptions(false);
              setAuthType('login');
              setIsDriverApplication(false);
            }}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span>Login as Driver</span>
          </button>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-2">New Drivers</h3>
          <p className="text-sm text-green-600 mb-4">Apply to become a driver and start earning</p>
          <button
            onClick={() => {
              setShowDriverOptions(false);
              setIsDriverApplication(true);
              // Directly call onLogin with driver application data
              onLogin({
                userType: 'driver',
                isRegisteredDriver: false,
                driverProfile: {
                  status: 'pending',
                  personalInfo: {
                    name: '',
                    email: '',
                    phone: '',
                    aadharNo: '',
                    address: ''
                  },
                  vehicleInfo: {
                    licensePlate: '',
                    vehicleModel: '',
                    vehicleYear: '',
                    insuranceNo: ''
                  }
                }
              });
            }}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Apply as New Driver</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowDriverOptions(false)}
          className="w-full mt-4 text-gray-600 hover:text-gray-800"
        >
          Back to Login Options
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Taxi className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CabConnect</span>
            </div>
            {!selectedType && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleUserTypeSelect('rider')}
                  className={`px-4 py-2 rounded-lg ${
                    userType === 'rider'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Rider
                </button>
                <button
                  onClick={() => handleUserTypeSelect('driver')}
                  className={`px-4 py-2 rounded-lg ${
                    userType === 'driver'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Driver
                </button>
                <button
                  onClick={() => handleUserTypeSelect('admin')}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        {!selectedType ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to CabConnect</h2>
            <p className="text-gray-600">Please select your user type to continue</p>
          </div>
        ) : selectedType === 'admin' ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold">Admin Login</h2>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Login as Admin
              </button>
            </form>
          </div>
        ) : showDriverOptions ? (
          renderDriverOptions()
        ) : (
          <AuthForm
            type={authType}
            userType={selectedType}
            onSubmit={handleSubmit}
            onToggle={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
            isDriverApplication={isDriverApplication}
          />
        )}
      </main>

      <footer className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} CabConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}