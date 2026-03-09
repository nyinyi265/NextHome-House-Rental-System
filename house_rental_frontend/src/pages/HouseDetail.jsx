import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Bed, Bath, Users, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import houseService from '../services/houseService';
import { AuthContext } from '../context/AuthContext';

export default function HouseDetail() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const role = (() => {
    if (!user) return null;
    if (user.role) return user.role;
    if (user.roles && user.roles.length) return user.roles[0].name;
    return null;
  })();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    houseService
      .get(id, token, role)
      .then((response) => {
        const houseData = response.data?.house || response.house || response;
        setProperty(houseData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch house', err);
        setError(err.message || 'Unable to load property');
      })
      .finally(() => setLoading(false));
  }, [id, token, role]);

  const nextPhoto = () => {
    const photos = property?.house_photos || property?.photos || [];
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    const photos = property?.house_photos || property?.photos || [];
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-6 text-red-500">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="p-6">Property not found</p>
      </div>
    );
  }

  // Extract property details with fallbacks
  const title = property.title || 'Property Title';
  const location = property.location || property.address || 'Location not specified';
  const price = property.price_per_month || property.price || 0;
  const description = property.description || 'No description available.';
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const maxGuests = property.max_guests || property.guests || 0;
  const beds = property.beds || 0;
  const rating = property.rating || 0;
  const propertyType = property.property_type || property.type || 'Apartment';
  
  // Get amenities from the API response
  const amenities = property.amenties || property.amenities || [];
  
  // Get house photos
  const photos = property.house_photos || property.photos || [];
  const mainPhoto = photos.length > 0 ? photos[currentPhotoIndex]?.photo_url : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96 rounded-xl overflow-hidden bg-gray-200">
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2 relative">
            {mainPhoto ? (
              <img 
                src={mainPhoto} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-6xl">🏠</span>
              </div>
            )}
            {photos.length > 1 && (
              <>
                <button 
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnail Images */}
          {photos.slice(0, 4).map((photo, index) => (
            <div key={index} className="hidden md:block relative h-48">
              <img 
                src={photo.photo_url} 
                alt={`${title} ${index + 1}`} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setCurrentPhotoIndex(index)}
              />
            </div>
          ))}
        </div>
        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPhotoIndex ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Title Section */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-lg">{location}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {propertyType}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="border-b py-6">
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Bed className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">{bedrooms} Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">{bathrooms} Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">Up to {maxGuests} Guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">{beds} Beds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b py-6">
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Amenities */}
            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenities.length > 0 ? (
                  amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{amenity.name || amenity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Wifi</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Kitchen</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Air Conditioning</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Heating</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Parking</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>TV</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Reserve Card */}
          <div className="lg:w-96">
            <div className="border rounded-xl p-6 shadow-lg sticky top-4">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-gray-600"> / month</span>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b">
                  <div className="p-3 border-r">
                    <p className="text-xs text-gray-500 font-medium">CHECK-IN</p>
                    <p className="font-medium">Add date</p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 font-medium">CHECKOUT</p>
                    <p className="font-medium">Add date</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-medium">GUESTS</p>
                  <p className="font-medium">{maxGuests} guests</p>
                </div>
              </div>

              <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors">
                Reserve
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                You won't be charged yet
              </p>

              {/* Price Breakdown */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="underline">${price} x 30 nights</span>
                  <span>${price * 30}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>$50</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>$100</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total before taxes</span>
                  <span>${price * 30 + 150}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
