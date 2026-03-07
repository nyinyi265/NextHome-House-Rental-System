import React from 'react';
import './PropertyCard.css';

export default function PropertyCard({ title, location, price, rating, featured }) {
  return (
    <div className={`property-card${featured ? ' featured' : ''}`}>
      {featured && <span className="badge">Featured</span>}
      <div className="property-image" />
      <div className="property-info">
        <h3>{title}</h3>
        <p className="location">{location}</p>
        <p className="price">${price} <span>per night</span></p>
        <p className="rating">⭐ {rating}</p>
      </div>
    </div>
  );
}
