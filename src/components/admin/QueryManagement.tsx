import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, MessageCircle } from 'lucide-react';

export default function QueryManagement() {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [queries, setQueries] = useState<any[]>([]);
  const [showQueryDetails, setShowQueryDetails] = useState<string | null>(null);

  // Dummy queries data
  const dummyQueries = [
    {
      id: '1',
      userType: 'rider',
      userName: 'Rahul Sharma',
      subject: 'Payment Failed but Amount Deducted',
      status: 'open',
      priority: 'high',
      createdAt: '2024-03-15T10:30:00',
      lastUpdated: '2024-03-15T11:00:00',
      description: 'Payment was deducted from my account but ride shows as unpaid',
      category: 'payment',
      responses: []
    },
    {
      id: '2',
      userType: 'driver',
      userName: 'Amit Kumar',
      subject: 'App Crashing During Ride',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-03-14T15:20:00',
      lastUpdated: '2024-03-14T16:00:00',
      description: 'App keeps crashing when I try to start the ride',
      category: 'technical',
      responses: []
    },
    {
      id: '3',
      userType: 'rider',
      userName: 'Priya Singh',
      subject: 'Driver Behavior Issue',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-03-13T09:15:00',
      lastUpdated: '2024-03-13T14:30:00',
      description: 'Driver was rude and took longer route',
      category: 'service',
      responses: ['Issue investigated and resolved. Driver warned.']
    },
    // Add more queries here...
  ];

  useEffect(() => {
    setQueries(dummyQueries);
  }, []);

  const handleResolveQuery = (queryId: string) => {
    setQueries(queries.map(q => 
      q.id === queryId ? { ...q, status: 'resolved', lastUpdated: new Date().toISOString() } : q
    ));
  };

  const handleAddResponse = (queryId: string, response: string) => {
    setQueries(queries.map(q => 
      q.id === queryId ? {
        ...q,
        responses: [...q.responses, response],
        lastUpdated: new Date().toISOString(),
        status: 'resolved'
      } : q
    ));
  };

  const filteredQueries = queries.filter(query => {
    const matchesFilter = filter === 'all' || query.status === filter;
    const matchesSearch = query.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const QueryDetails = ({ query }: { query: any }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{query.subject}</h3>
            <p className="text-sm text-gray-500">From: {query.userName} ({query.userType})</p>
          </div>
          <button
            onClick={() => setShowQueryDetails(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{query.description}</p>
          </div>

          <div className="flex space-x-4 text-sm">
            <span className="text-gray-500">Created: {new Date(query.createdAt).toLocaleString()}</span>
            <span className="text-gray-500">Last Updated: {new Date(query.lastUpdated).toLocaleString()}</span>
          </div>

          {query.responses.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Responses:</h4>
              {query.responses.map((response: string, index: number) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg text-sm">
                  {response}
                </div>
              ))}
            </div>
          )}

          {query.status !== 'resolved' && (
            <div className="space-y-2">
              <textarea
                placeholder="Add your response..."
                className="w-full p-3 border rounded-lg"
                rows={3}
                id={`response-${query.id}`}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const response = (document.getElementById(`response-${query.id}`) as HTMLTextAreaElement).value;
                    if (response) {
                      handleAddResponse(query.id, response);
                      setShowQueryDetails(null);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Response
                </button>
                <button
                  onClick={() => handleResolveQuery(query.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>
        
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Queries</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQueries.map((query) => (
          <div key={query.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{query.subject}</h3>
                <p className="text-sm text-gray-500">From: {query.userName} ({query.userType})</p>
              </div>
              <div className="flex items-center space-x-2">
                {query.priority === 'high' && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  query.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                  query.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {query.status}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created: {new Date(query.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {query.responses.length} responses
                </span>
              </div>
              <button
                onClick={() => setShowQueryDetails(query.id)}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showQueryDetails && (
        <QueryDetails query={queries.find(q => q.id === showQueryDetails)} />
      )}
    </div>
  );
} 