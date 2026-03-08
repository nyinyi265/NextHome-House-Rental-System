import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import houseService from '../services/houseService';
import { AuthContext } from '../context/AuthContext';
import './HouseDetail.css';

export default function HouseDetail() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const role = (() => {
    if (!user) return null;
    if (user.role) return user.role;
    if (user.roles && user.roles.length) return user.roles[0].name;
    return null;
  })();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    houseService
      .get(id, token, role)
      .then((data) => {
        setProperty(data.house || data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch house', err);
        setError(err.message || 'Unable to load property');
      })
      .finally(() => setLoading(false));
  }, [id, token, role]);

  if (loading) {
    return (
      <div className="house-detail-page">
        <Navbar />
        <div className="house-detail-body">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="house-detail-page">
        <Navbar />
        <div className="house-detail-body error">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="house-detail-page">
        <Navbar />
        <p>Property not found</p>
      </div>
    );
  }

  return (
    <div className="house-detail-page">
      <Navbar />
      <div className="house-detail-header">
        <Link to="/explore" className="back-link">&lt; Back to Explore</Link>
        <h1>{property.title}</h1>
        <p className="location">{property.location}</p>
      </div>
      <div className="house-detail-body">
        <p>This is the detail page for {property.title}. Add slides, descriptions, amenities etc.</p>
      </div>
    </div>
  );
}
