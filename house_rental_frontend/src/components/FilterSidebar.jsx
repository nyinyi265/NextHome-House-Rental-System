import React from 'react';

export default function FilterSidebar() {
  return (
    <aside className="w-60 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="mt-0 mb-4 text-lg font-semibold">Filters</h3>
      <div className="mb-6">
        <h4 className="m-0 mb-2 text-base font-medium">Property Type</h4>
        <label className="block text-sm mb-1">
          <input type="radio" name="type" value="all" defaultChecked className="mr-2" /> 
          All
        </label>
        <label className="block text-sm mb-1">
          <input type="radio" name="type" value="beachfront" className="mr-2" /> 
          Beachfront
        </label>
        <label className="block text-sm mb-1">
          <input type="radio" name="type" value="mountain" className="mr-2" /> 
          Mountain
        </label>
        <label className="block text-sm mb-1">
          <input type="radio" name="type" value="city" className="mr-2" /> 
          City
        </label>
        <label className="block text-sm mb-1">
          <input type="radio" name="type" value="countryside" className="mr-2" /> 
          Countryside
        </label>
        <label className="block text-sm mb-1">
          <input type="radio" name="type" value="luxury" className="mr-2" /> 
          Luxury
        </label>
      </div>
      <div className="mb-6">
        <h4 className="m-0 mb-2 text-base font-medium">Max Price per Night</h4>
        <input type="range" min="0" max="1000" className="w-full" />
        <div className="mt-1 text-sm text-gray-600">Up to $500</div>
      </div>
      <div className="mb-6">
        <h4 className="m-0 mb-2 text-base font-medium">Amenities</h4>
        <label className="block text-sm mb-1">
          <input type="checkbox" className="mr-2" /> 
          Wifi
        </label>
        <label className="block text-sm mb-1">
          <input type="checkbox" className="mr-2" /> 
          Pool
        </label>
        <label className="block text-sm mb-1">
          <input type="checkbox" className="mr-2" /> 
          Kitchen
        </label>
        <label className="block text-sm mb-1">
          <input type="checkbox" className="mr-2" /> 
          AC
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-sm">
          <input type="checkbox" className="mr-2" /> 
          Superhost Only
        </label>
      </div>
    </aside>
  );
}
