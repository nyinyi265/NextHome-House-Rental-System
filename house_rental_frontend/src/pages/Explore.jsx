import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar/Navbar';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import houseService from '../services/houseService';
import { AuthContext } from '../context/AuthContext';

export default function Explore() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      .list(token, role)
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
  }, [token, role]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <header className="py-8 bg-gray-100 text-center">
        <SearchBar />
      </header>
      <div className="flex gap-6 max-w-7xl mx-auto px-4 py-6">
        <FilterSidebar />
        <div className="flex-1">
          {loading && <div className="text-center py-8">Loading properties...</div>}
          {error && <div className="text-red-500 py-4">{error}</div>}
          {!loading && !error && (
            <>
              <div className="text-sm mb-3 text-gray-600">{properties.length} properties found</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard key={p.id} {...p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
