import React, { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
  userType: 'rider' | 'driver';
  onSubmit: (data: any) => void;
  onToggle: () => void;
}

export default function AuthForm({ type, userType, onSubmit, onToggle }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    licensePlate: '',
    vehicleModel: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        {type === 'login' ? 'Sign in to continue' : `Join as a ${userType}`}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {userType === 'driver' && (
              <>
                <input
                  type="text"
                  name="licensePlate"
                  placeholder="License Plate Number"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="vehicleModel"
                  placeholder="Vehicle Model"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </>
            )}
          </>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={onToggle}
            className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {type === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}