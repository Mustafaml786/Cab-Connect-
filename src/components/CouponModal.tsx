import React, { useState } from 'react';
import { X, Check, Tag } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
  expiryDate: Date;
  minFare: number;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (coupon: Coupon) => void;
  currentFare: number;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage',
    description: 'Get 20% off on your first ride',
    expiryDate: new Date(2024, 12, 31),
    minFare: 100
  },
  {
    id: '2',
    code: 'FLAT50',
    discount: 50,
    type: 'fixed',
    description: 'Get ₹50 off on your ride',
    expiryDate: new Date(2024, 6, 30),
    minFare: 200
  },
  {
    id: '3',
    code: 'SUMMER25',
    discount: 25,
    type: 'percentage',
    description: 'Get 25% off on rides this summer',
    expiryDate: new Date(2024, 8, 31),
    minFare: 150
  }
];

export default function CouponModal({ isOpen, onClose, onApplyCoupon, currentFare }: CouponModalProps) {
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');

  const handleApplyCode = () => {
    const coupon = mockCoupons.find(c => c.code === enteredCode.toUpperCase());
    
    if (!coupon) {
      setError('Invalid coupon code');
      return;
    }

    if (new Date() > coupon.expiryDate) {
      setError('Coupon has expired');
      return;
    }

    if (currentFare < coupon.minFare) {
      setError(`Minimum fare of ₹${coupon.minFare} required`);
      return;
    }

    onApplyCoupon(coupon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Apply Coupon</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value);
                setError('');
              }}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApplyCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Available Coupons</h4>
            <div className="space-y-3">
              {mockCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{coupon.code}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEnteredCode(coupon.code);
                        setError('');
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      Min. fare: ₹{coupon.minFare}
                    </span>
                    <span className="text-sm text-gray-500">
                      Expires: {coupon.expiryDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 