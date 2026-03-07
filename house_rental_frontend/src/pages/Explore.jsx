import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import './Explore.css';

const properties = [
  { id: 1, title: 'Oceanfront Villa Paradise', location: 'Malibu, California', price: 450, rating: 4.9, featured: true },
  { id: 2, title: 'Alpine Luxury Chalet', location: 'Zermatt, Switzerland', price: 380, rating: 4.8, featured: true },
  { id: 3, title: 'Tuscan Villa Retreat', location: 'Tuscany, Italy', price: 320, rating: 4.7 },
  { id: 4, title: 'Paris Boutique Apartment', location: 'Paris, France', price: 280, rating: 4.8 },
  { id: 5, title: 'Bali Jungle Retreat', location: 'Bali, Indonesia', price: 180, rating: 4.9 },
  { id: 6, title: 'NYC Luxury Studio', location: 'New York, USA', price: 350, rating: 4.7 },
  { id: 7, title: 'Barcelona Gothic Quarter', location: 'Barcelona, Spain', price: 240, rating: 4.6 },
];

export default function Explore() {
  return (
    <div className="explore-page">
      <Navbar />
      <header className="explore-search">
        <SearchBar />
      </header>
      <div className="explore-content">
        <FilterSidebar />
        <div className="explore-listings">
          <div className="listings-count">{properties.length} properties found</div>
          <div className="cards-grid">
            {properties.map((p) => (
              <PropertyCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
