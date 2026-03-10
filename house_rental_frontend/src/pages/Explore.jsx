import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar/Navbar';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/Loading';
import { Search, MapPin } from 'lucide-react';
import houseService from '../services/houseService';
import { AuthContext } from '../context/AuthContext';

export default function Explore() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, city: searchQuery });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Search and Filter Bar */}
      <div className="sticky top-0 bg-white z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 hover:shadow-md transition-shadow">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search by city or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Filter Toggle Button */}
            {/* <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-full hover:shadow-md transition-shadow whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="border-b py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-gray-600">
            {properties.length} properties found
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar - Always visible on desktop */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>
          
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
