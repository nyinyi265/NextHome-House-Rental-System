import React from 'react';
import './Features.css';

const featuresData = [
  {
    title: 'Search Easily',
    description: 'Quickly find houses by location, price and amenities.',
    icon: '🔍'
  },
  {
    title: 'Secure Booking',
    description: 'Book a property with confidence using our secure system.',
    icon: '✅'
  },
  {
    title: '24/7 Support',
    description: 'Our support team is here to help you any time.',
    icon: '💬'
  }
];

const Features = () => {
  return (
    <section id="features" className="hr-features">
      <h2>Why choose us?</h2>
      <div className="feature-cards">
        {featuresData.map((f, i) => (
          <div key={i} className="card">
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;