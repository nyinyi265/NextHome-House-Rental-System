import React from 'react';
import './SearchBar.css';

export default function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Where to?" />
      <input type="date" placeholder="Check in" />
      <input type="date" placeholder="Check out" />
      <button className="search-button">Search</button>
    </div>
  );
}
