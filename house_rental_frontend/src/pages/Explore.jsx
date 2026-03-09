import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar/Navbar';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/Loading';
import houseService from '../services/houseService';
import { AuthContext } from '../context/AuthContext';

export default function Explore() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const { token, user } = useContext(AuthContext);

  const role = (() => {
    if (!user) return null;
    if (user.role) return user.role;
    if (user.roles && user.roles.length) return user.roles[0].name;
    return null;
  })();

  useEffect(() => {
    setLoading(true);
    houseService
      .list(token, role, filters)
      .then((response) => {
        // API returns { status, statusCode, data: { houses }, message }
        const housesData = response.data?.houses || response.houses || [];
        setProperties(housesData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch houses', err);
        setError(err.message || 'Unable to load properties');
      })
      .finally(() => setLoading(false));
  }, [token, role, filters]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Search Section */}
      <div className="sticky top-0 bg-white z-40 pt-4 pb-2 shadow-sm">
        <SearchBar />
      </div>

      {/* Filter Toggle */}
      <div className="border-b py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {properties.length} properties found
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
          
          {/* Properties Grid */}
          <div className="flex-1">
            {loading && <PropertyGridSkeleton count={8} />}
            {error && <div className="text-red-500 py-4 text-center">{error}</div>}
            {!loading && !error && properties.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No properties found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
            {!loading && !error && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((p) => (
                  <PropertyCard key={p.id} {...p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
