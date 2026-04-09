import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Check } from 'lucide-react';
import houseService from '../services/houseService';

export default function AddHouseModal({ isOpen, onClose, onSuccess, token }) {
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [furnitures, setFurnitures] = useState([]);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'apartment',
    apartment_number: '',
    floor: '',
    area: '',
    street: '',
    township: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    price: '',
    is_available: true,
    available_from: '',
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedFurnitures, setSelectedFurnitures] = useState([]);
  const [photos, setPhotos] = useState([]);

  // Fetch amenities and furnitures on mount
  const fetchOptions = useCallback(async () => {
    if (!token) return;
    try {
      const [amentiesRes, furnituresRes] = await Promise.all([
        houseService.getLandlordAmenties(token),
        houseService.getLandlordFurnitures(token)
      ]);
      setAmenities(amentiesRes.data?.amenties || amentiesRes.amenties || []);
      setFurnitures(furnituresRes.data?.furnitures || furnituresRes.furnitures || []);
    } catch (err) {
      console.error('Failed to fetch options', err);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      fetchOptions();
    }
  }, [isOpen, token, fetchOptions]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from title and city
    if (name === 'title' || name === 'city') {
      const title = name === 'title' ? value : formData.title;
      const city = name === 'city' ? value : formData.city;
      if (title) {
        const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const citySlug = city ? city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
        const slug = citySlug ? `${titleSlug}-${citySlug}` : titleSlug;
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleFurniture = (id) => {
    setSelectedFurnitures(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const data = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        // Handle boolean values explicitly
        if (typeof value === 'boolean') {
          data.append(key, value ? '1' : '0');
        } else if (value !== '' && value !== null) {
          data.append(key, value);
        }
      });
      
      // Add amenities
      selectedAmenities.forEach(id => {
        data.append('amenty_ids[]', id);
      });
      
      // Add furnitures
      selectedFurnitures.forEach(id => {
        data.append('furniture_ids[]', id);
      });
      
      // Add photos
      photos.forEach(photo => {
        data.append('photos[]', photo);
      });

      await houseService.createHouse(token, data);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to create house', err);
      setError(err.message || err.error || 'Failed to create house. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      slug: '',
      type: 'apartment',
      apartment_number: '',
      floor: '',
      area: '',
      street: '',
      township: '',
      city: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      price: '',
      is_available: true,
      available_from: '',
    });
    setSelectedAmenities([]);
    setSelectedFurnitures([]);
    setPhotos([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-emerald-50">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Info Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Beautiful apartment in downtown"
                  />
                </div>
                <div className="hidden">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (per month) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Township</label>
                  <input
                    type="text"
                    name="township"
                    value={formData.township}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="North Township"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Yangon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartment Number</label>
                  <input
                    type="text"
                    name="apartment_number"
                    value={formData.apartment_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="A-101"
                  />
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                  <input
                    type="date"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Available now</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe your property..."
              />
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      selectedAmenities.includes(amenity.id)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedAmenities.includes(amenity.id) && <Check className="w-4 h-4" />}
                    <span className="text-sm">{amenity.name}</span>
                  </button>
                ))}
                {amenities.length === 0 && (
                  <p className="text-gray-500 text-sm">No amenities available</p>
                )}
              </div>
            </div>

            {/* Furnitures */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Furniture</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {furnitures.map((furniture) => (
                  <button
                    key={furniture.id}
                    type="button"
                    onClick={() => toggleFurniture(furniture.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      selectedFurnitures.includes(furniture.id)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedFurnitures.includes(furniture.id) && <Check className="w-4 h-4" />}
                    <span className="text-sm">{furniture.name}</span>
                  </button>
                ))}
                {furnitures.length === 0 && (
                  <p className="text-gray-500 text-sm">No furniture available</p>
                )}
              </div>
            </div>

            {/* Photos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Photos</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label htmlFor="photos" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload photos</p>
                  <p className="text-sm text-gray-400">JPG, PNG, GIF (max 4MB each)</p>
                </label>
              </div>
              
              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
