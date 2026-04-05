import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import rentalService from '../../services/rentalService';
import env from '../../environment/environment';
import { Home, MapPin, Calendar, DollarSign, FileText, Loader2, AlertCircle } from 'lucide-react';

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRentals() {
      try {
        const data = await rentalService.getMyRentals();
        
        // Sort rentals: ACTIVE first, then others
        const sorted = [...data].sort((a, b) => {
          const statusOrder = { active: 0, ended: 1, cancelled: 1 };
          const statusA = statusOrder[a.status?.toLowerCase()] ?? 2;
          const statusB = statusOrder[b.status?.toLowerCase()] ?? 2;
          return statusA - statusB;
        });
        
        setRentals(sorted);
      } catch (err) {
        setError(err.message || 'Failed to load rentals');
      } finally {
        setLoading(false);
      }
    }

    fetchRentals();
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

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-emerald-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading your rentals...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
            <p className="text-gray-600 mt-1">View all your rental properties</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {rentals.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Rentals Yet</h3>
              <p className="text-gray-500 mb-6">You haven't rented any properties yet.</p>
              <Link 
                to="/explore" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Explore Properties
              </Link>
            </div>
          )}

          {/* Rental Cards */}
          {rentals.length > 0 && (
            <div className="space-y-4">
              {rentals.map((rental) => (
                <div 
                  key={rental.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* House Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* House Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {rental.house?.house_photos?.[0]?.photo_path ? (
                            <img 
                              src={env.getImageUrl(rental.house.house_photos[0].photo_path)}
                              alt={rental.house?.title}
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
                            {rental.house?.title || 'Unknown Property'}
                          </h3>
                          
                          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {[rental.house?.apartment_number, rental.house?.street, rental.house?.township, rental.house?.city]
                                .filter(Boolean)
                                .join(', ') || 'Address not available'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-primary">
                                {formatCurrency(rental.monthly_rent)}
                              </span>
                              <span className="text-gray-400">/month</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Dates */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                        {rental.status ? rental.status.charAt(0).toUpperCase() + rental.status.slice(1) : 'Unknown'}
                      </span>

                      <div className="flex flex-col items-end gap-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>Start: {formatDate(rental.rental_start_date)}</span>
                        </div>
                        {rental.rental_end_date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>End: {formatDate(rental.rental_end_date)}</span>
                          </div>
                        )}
                      </div>
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
