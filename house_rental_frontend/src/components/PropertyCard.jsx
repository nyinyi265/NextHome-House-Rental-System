import React from 'react';
import './PropertyCard.css';

import { Link } from 'react-router-dom';

export default function PropertyCard({ id, title, location, price, rating, featured }) {
  return (
    <Link to={`/houses/${id}`} className="property-card-link">
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
    </Link>
  );
}
