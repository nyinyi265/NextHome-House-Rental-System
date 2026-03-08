
import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar/Navbar';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import houseService from '../services/houseService';
import { AuthContext } from '../context/AuthContext';
import './Explore.css';

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
      .then((data) => {
        setProperties(data.houses || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch houses', err);
        setError(err.message || 'Unable to load properties');
      })
      .finally(() => setLoading(false));
  }, [token, role]);

  return (
    <div className="explore-page">
      <Navbar />
      <header className="explore-search">
        <SearchBar />
      </header>
      <div className="explore-content">
        <FilterSidebar />
        <div className="explore-listings">
          {loading && <div>Loading properties...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && (
            <>
              <div className="listings-count">{properties.length} properties found</div>
              <div className="cards-grid">
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
