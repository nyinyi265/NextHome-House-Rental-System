import React, { useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import houseService from '../services/houseService';

export default function FilterSidebar({ filters, onFilterChange }) {
  const [amenties, setAmenties] = useState([]);
  
  // Initialize local state from filters prop
  const [localFilters, setLocalFilters] = useState({
    min_price: filters?.min_price || '',
    max_price: filters?.max_price || '',
    type: filters?.type || '',
    bedrooms: filters?.bedrooms || '',
    bathrooms: filters?.bathrooms || '',
    city: filters?.city || '',
    street: filters?.street || '',
    township: filters?.township || '',
    area: filters?.area || '',
    amenties: filters?.amenties || [],
  });

  // Fetch amenities and furniture on mount
  useEffect(() => {
    houseService.getAmenties()
      .then((response) => {
        const amentiesData = response.data?.amenties || response.amenties || [];
        setAmenties(amentiesData);
      })
      .catch((err) => console.error('Failed to fetch amenities', err));

    // houseService.getFurnitures()
    //   .then((response) => {
    //     const furnituresData = response.data?.furnitures || response.furnitures || [];
    //     setFurnitures(furnituresData);
    //   })
    //   .catch((err) => console.error('Failed to fetch furnitures', err));
  }, []);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters({
      min_price: filters?.min_price || '',
      max_price: filters?.max_price || '',
      type: filters?.type || '',
      bedrooms: filters?.bedrooms || '',
      bathrooms: filters?.bathrooms || '',
      city: filters?.city || '',
      street: filters?.street || '',
      township: filters?.township || '',
      area: filters?.area || '',
      amenties: filters?.amenties || [],
      furnitures: filters?.furnitures || [],
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amentyId) => {
    const currentAmenities = localFilters.amenties || [];
    const newAmenities = currentAmenities.includes(amentyId)
      ? currentAmenities.filter(id => id !== amentyId)
      : [...currentAmenities, amentyId];
    handleFilterChange('amenties', newAmenities);
  };

  const handleFurnitureToggle = (furnitureId) => {
    const currentFurnitures = localFilters.furnitures || [];
    const newFurnitures = currentFurnitures.includes(furnitureId)
      ? currentFurnitures.filter(id => id !== furnitureId)
      : [...currentFurnitures, furnitureId];
    handleFilterChange('furnitures', newFurnitures);
  };

  const clearFilters = () => {
    const emptyFilters = {
      min_price: '',
      max_price: '',
      type: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      street: '',
      township: '',
      area: '',
      amenties: [],
      furnitures: [],
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="w-64 flex-shrink-0">
      {/* Map Button */}
      {/* <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-full hover:shadow-md transition-shadow mb-4">
        <Map className="w-4 h-4" />
        <span className="text-sm font-medium">Show map</span>
      </button> */}

      {/* Filters Card */}
      <div className="border rounded-3xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-sm text-red-500 hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Price range</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                placeholder="Min"
                value={localFilters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                className="w-full pl-7 pr-2 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full pl-7 pr-2 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Type of Place */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Type of place</label>
          <select
            value={localFilters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          >
            <option value="">Any type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Bedrooms</label>
          <select
            value={localFilters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Bathrooms</label>
          <select
            value={localFilters.bathrooms}
            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
          <input
            type="text"
            placeholder="Enter city"
            value={localFilters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Street */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Street</label>
          <input
            type="text"
            placeholder="Enter street"
            value={localFilters.street}
            onChange={(e) => handleFilterChange('street', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Township */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Township</label>
          <input
            type="text"
            placeholder="Enter township"
            value={localFilters.township}
            onChange={(e) => handleFilterChange('township', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Area (sqft)</label>
          <input
            type="text"
            placeholder="Enter area"
            value={localFilters.area}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Amenities</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {amenties.map((amenty) => (
              <label key={amenty.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.amenties?.includes(amenty.id)}
                  onChange={() => handleAmenityToggle(amenty.id)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm">{amenty.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Furniture */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Furniture</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {furnitures.map((furniture) => (
              <label key={furniture.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.furnitures?.includes(furniture.id)}
                  onChange={() => handleFurnitureToggle(furniture.id)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm">{furniture.name}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/* More Filters Button */}
        <button className="w-full py-2 border rounded-lg hover:border-gray-400 transition-colors text-sm font-medium">
          More filters
        </button>
      </div>
    </div>
  );
}
