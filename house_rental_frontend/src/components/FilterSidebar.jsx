import React from 'react';
import './FilterSidebar.css';

export default function FilterSidebar() {
  return (
    <aside className="filter-sidebar">
      <h3>Filters</h3>
      <div className="filter-group">
        <h4>Property Type</h4>
        <label><input type="radio" name="type" value="all" defaultChecked /> All</label>
        <label><input type="radio" name="type" value="beachfront" /> Beachfront</label>
        <label><input type="radio" name="type" value="mountain" /> Mountain</label>
        <label><input type="radio" name="type" value="city" /> City</label>
        <label><input type="radio" name="type" value="countryside" /> Countryside</label>
        <label><input type="radio" name="type" value="luxury" /> Luxury</label>
      </div>
      <div className="filter-group">
        <h4>Max Price per Night</h4>
        <input type="range" min="0" max="1000" />
        <div className="price-value">Up to $500</div>
      </div>
      <div className="filter-group">
        <h4>Amenities</h4>
        <label><input type="checkbox" /> Wifi</label>
        <label><input type="checkbox" /> Pool</label>
        <label><input type="checkbox" /> Kitchen</label>
        <label><input type="checkbox" /> AC</label>
      </div>
      <div className="filter-group">
        <label><input type="checkbox" /> Superhost Only</label>
      </div>
    </aside>
  );
}
