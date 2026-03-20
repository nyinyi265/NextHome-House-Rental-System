import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import houseService from '../services/houseService';
import env from '../environment/environment';
import { Home, MapPin, Calendar, FileText, Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyRentalApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    async function fetchApplications() {
      try {
        const token = localStorage.getItem('token');
        const data = await houseService.getTenantRentalApplications(token);
        
        // Extract applications from response
        const apps = data.data?.rental_applications || data.rental_applications || [];
        
        // Sort: pending first, then approved, then rejected
        const sorted = [...apps].sort((a, b) => {
          const statusOrder = { pending: 0, approved: 1, rejected: 2 };
          const statusA = statusOrder[a.status?.toLowerCase()] ?? 3;
          const statusB = statusOrder[b.status?.toLowerCase()] ?? 3;
          return statusA - statusB;
        });
        
        console.log('sorted', sorted);
        setApplications(sorted);
      } catch (err) {
        setError(err.message || 'Failed to load rental applications');
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusIcon(status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-emerald-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading your applications...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Rental Applications</h1>
            <p className="text-gray-600 mt-1">View all your rental property applications</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Pending ({applications.filter(a => a.status?.toLowerCase() === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Approved ({applications.filter(a => a.status?.toLowerCase() === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              <XCircle className="w-4 h-4 inline mr-1" />
              Rejected ({applications.filter(a => a.status?.toLowerCase() === 'rejected').length})
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {filteredApplications.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No Applications Yet' : `No ${filter} applications`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't applied to any properties yet." 
                  : `You don't have any ${filter} applications.`}
              </p>
              <Link 
                to="/explore" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Explore Properties
              </Link>
            </div>
          )}

          {/* Application Cards */}
          {filteredApplications.length > 0 && (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* House Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* House Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {application.house?.house_photos[0]?.photo_path ? (
                            <img 
                              src={env.getImageUrl(application.house.house_photos[0].photo_path)}
                              alt={application.house?.title}
                              className="w-full h-full object-cover"
                            />
                          ) : application.house?.house_photos[0]?.photo_path ? (
                            <img 
                              src={env.getImageUrl(application.house.house_photos[0].photo_path)}
                              alt={application.house?.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {application.house?.title || 'Unknown Property'}
                          </h3>
                          
                          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {[application.house?.apartment_number, application.house?.street, application.house?.township, application.house?.city]
                                .filter(Boolean)
                                .join(', ') || 'Address not available'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Duration: {application.rental_duration || '-'} months</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Applied: {formatDate(application.created_at)}</span>
                            </div>
                          </div>

                          {application.message && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                              <span className="font-medium">Your Message:</span> {application.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Unknown'}
                      </span>

                      {application.status === 'approved' && (
                        <Link 
                          to="/my-rentals"
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          View Rental
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
