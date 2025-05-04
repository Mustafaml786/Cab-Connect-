import React, { useState } from 'react';
import { CreditCard, Wallet, History, Plus, Trash2, Check } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  details: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    details: 'Visa ending in 4242',
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    details: 'Mastercard ending in 1234',
    isDefault: false
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(2024, 2, 15),
    amount: 250,
    status: 'completed',
    description: 'Ride from Connaught Place to Aerocity'
  },
  {
    id: '2',
    date: new Date(2024, 2, 10),
    amount: 180,
    status: 'completed',
    description: 'Ride from Saket to Hauz Khas'
  }
];

export default function PaymentPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate and process the card details
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      details: `Visa ending in ${newCardDetails.number.slice(-4)}`,
      isDefault: false
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddCard(false);
    setNewCardDetails({ number: '', expiry: '', cvv: '', name: '' });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
      
      <div className="space-y-6">
        {/* Payment Methods Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Saved Payment Methods</h3>
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Add New Card</span>
            </button>
          </div>

          {showAddCard && (
            <form onSubmit={handleAddPaymentMethod} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={newCardDetails.number}
                    onChange={(e) => setNewCardDetails({ ...newCardDetails, number: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={newCardDetails.name}
                    onChange={(e) => setNewCardDetails({ ...newCardDetails, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={newCardDetails.expiry}
                    onChange={(e) => setNewCardDetails({ ...newCardDetails, expiry: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={newCardDetails.cvv}
                    onChange={(e) => setNewCardDetails({ ...newCardDetails, cvv: e.target.value })}
                    placeholder="123"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Card
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {method.type === 'card' ? (
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Wallet className="w-6 h-6 text-blue-600" />
                  )}
                  <span>{method.details}</span>
                  {method.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <History className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Transaction History</h3>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.date.toLocaleDateString()} • {transaction.status}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">₹{transaction.amount}</span>
                  {transaction.status === 'completed' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 