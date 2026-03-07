import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PropertyTags from '../components/PropertyTags';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const featuredProperties = [
  { id: 1, title: 'Oceanfront Villa Paradise', location: 'Malibu, California', price: 450, rating: 4.9 },
  { id: 2, title: 'Alpine Luxury Chalet', location: 'Zermatt, Switzerland', price: 380, rating: 4.8 },
];

const allProperties = [
  ...featuredProperties,
  { id: 3, title: 'Tuscan Villa Retreat', location: 'Tuscany, Italy', price: 320, rating: 4.7 },
  { id: 4, title: 'Tokyo Modern Penthouse', location: 'Tokyo, Japan', price: 290, rating: 4.9 },
  { id: 5, title: 'Bali Beachfront Paradise', location: 'Bali, Indonesia', price: 210, rating: 4.8 },
  { id: 6, title: 'Paris Elegant Apartment', location: 'Paris, France', price: 270, rating: 4.8 },
];

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <header className="hero-section">
        <h1>Discover Your Perfect Stay</h1>
        <p>Explore hand-picked luxury homes, beachfront villas, and urban apartments worldwide</p>
        <SearchBar />
      </header>
      <PropertyTags />

      <section className="featured-properties">
        <h2>Featured Properties</h2>
        <div className="cards-grid">
          {featuredProperties.map((p) => (
            <PropertyCard key={p.id} {...p} featured />
          ))}
        </div>
      </section>

      <section className="all-properties">
        <h2>All Listings</h2>
        <div className="cards-grid">
          {allProperties.map((p) => (
            <PropertyCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
