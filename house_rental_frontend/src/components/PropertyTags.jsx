import React from 'react';
import './PropertyTags.css';

const tags = ['All Properties', 'Beachfront', 'Mountain', 'City', 'Luxury'];

export default function PropertyTags() {
  return (
    <div className="property-tags">
      {tags.map((tag) => (
        <button key={tag} className="tag-button">
          {tag}
        </button>
      ))}
    </div>
  );
}
