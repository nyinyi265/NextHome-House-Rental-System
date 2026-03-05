import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hr-hero">
      <div className="hero-content">
        <h2>Find your perfect home</h2>
        <p>Browse thousands of houses, apartments and rooms available for rent in your area.</p>
        <a href="#features" className="cta-button">Explore Now</a>
      </div>
    </section>
  );
};

export default Hero;
