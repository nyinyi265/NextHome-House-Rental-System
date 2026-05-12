import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { Scale, X, Star, Bed, Bath, Maximize, Wifi, Car, Snowflake, Sofa, PawPrint, MapPin, Home, Building2, Loader2, Info, Check, Dumbbell, Shield, TreeDeciduous, Waves, Sun, WashingMachine, Square } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import env from '../../environment/environment';

export default function Compare() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { compareProperties: properties, loading, removeFromCompare, clearCompare } = useCompare();

  // Helper to get amenity names as lowercase strings
  const getAmenityNames = (property) => {
    const list = property.house_amenties || property.houseAmenities || property.amenities || property.amenties || [];
    return list.map(item => {
      if (typeof item === 'string') return item.toLowerCase();
      return (item.name || item).toLowerCase();
    });
  };

  // Helper to normalize amenity name for comparison
  const normalizeAmenity = (name) => {
    return name.toLowerCase().replace(/[_-]/g, ' ').trim();
  };

  // Helper to get amenity icon based on normalized name (for common amenities)
  const getAmenityIcon = (amenityName) => {
    const normalized = normalizeAmenity(amenityName);
    if (normalized.includes('wifi')) return Wifi;
    if (normalized.includes('parking') || normalized.includes('car')) return Car;
    if (normalized.includes('air') && normalized.includes('condition')) return Snowflake;
    if (normalized.includes('furniture') || normalized.includes('furnished')) return Sofa;
    if (normalized.includes('pet')) return PawPrint;
    return null;
  };

  // Common amenities that appear in the main amenities section
  const commonAmenities = ['wifi', 'parking', 'air conditioning', 'furnished', 'pet allowed'];

  // Helper to get special amenities (excluding common ones)
  const getSpecialAmenities = (property) => {
    const all = getAmenityNames(property);
    return all.filter(a => !commonAmenities.includes(a));
  };

  // Helper to get icon for special amenity
  const getSpecialAmenityIcon = (amenityName) => {
    const normalized = normalizeAmenity(amenityName);
    if (normalized.includes('balcony')) return Square;
    if (normalized.includes('swimming') && normalized.includes('pool')) return Waves;
    if (normalized.includes('garden') || normalized.includes('yard')) return TreeDeciduous;
    if (normalized.includes('gym') || normalized.includes('fitness')) return Dumbbell;
    if (normalized.includes('rooftop') || normalized.includes('roof')) return Sun;
    if (normalized.includes('security') || normalized.includes('cctv') || normalized.includes('guard')) return Shield;
    if (normalized.includes('laundry')) return WashingMachine;
    // if (normalized.includes('elevator') || normalized.includes('lift')) return Elevator;
    return Check;
  };

  // Helper to get furniture names
  const getFurnitureNames = (property) => {
    const list = property.house_furnitures || property.houseFurnitures || property.furnitures || [];
    return list.map(item => {
      if (typeof item === 'string') return item.toLowerCase();
      return (item.name || item).toLowerCase();
    });
  };

  const handleRemove = async (propertyId) => {
    await removeFromCompare(propertyId);
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    await clearCompare();
    setIsClearing(false);
    setShowClearDialog(false);
  };

const getResolvedImage = (property) => {
    const photos = property.house_photos || property.housePhotos || property.images || [];
    if (photos.length > 0) {
      const img = photos[0];
      if (typeof img === 'string') return img;
      if (img?.photo_path) return env.getImageUrl(img.photo_path);
      return img?.photo_url || img?.url || null;
    }
    return null;
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Collect all values for each column to highlight differences
  const priceValues = properties.map(p => p.price);
  const bedroomValues = properties.map(p => p.bedrooms);
  const bathroomValues = properties.map(p => p.bathrooms);
  const areaValues = properties.map(p => p.area);
  const typeValues = properties.map(p => p.type);
  const cityValues = properties.map(p => p.city);
  const addressValues = properties.map(p => [p.apartment_number, p.street, p.township].filter(Boolean).join(', '));





  // Render a cell value with highlight if differences exist
  const renderCell = (propertyIndex, value, allValues) => {
    const hasDifferentValues = allValues.length > 1;
    const isDifferent = hasDifferentValues && value !== allValues[0];

    return (
      <div className={`text-sm ${isDifferent ? 'text-red-600 font-medium bg-red-50 px-2 py-1 rounded' : 'text-gray-700'}`}>
        {value || 'N/A'}
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-gray-500">Loading comparison...</p>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No properties selected for comparison</h2>
            <p className="text-gray-600 mb-6">Add at least 2 properties from the Explore page to compare them side by side.</p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Explore Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compare Properties</h1>
            <p className="text-gray-600 mt-1">{properties.length} properties selected for comparison</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowClearDialog(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Property Preview Cards - Horizontal Scrollable */}
        <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
            {properties.map((property) => (
              <div key={property.id} className="w-80 bg-white rounded-2xl shadow-lg border overflow-hidden flex-shrink-0">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  {getResolvedImage(property) ? (
                    <img
                      src={getResolvedImage(property)}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/60" />
                    </div>
                  )}
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(property.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-md"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  {/* Rating Badge */}
                  {property.rating && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                    {property.title || property.location || 'Property'}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {[property.township, property.city].filter(Boolean).join(', ') || property.location || 'Location not specified'}
                  </p>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(property.price || property.price_per_month)}
                    </span>
                    <span className="text-sm text-gray-500">/ month</span>
                  </div>

                  {/* Key Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms != null && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                    )}
                    {property.area != null && (
                      <div className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        <span>{property.area} sq ft</span>
                      </div>
                    )}
                  </div>

                  {/* Type */}
                  {property.type && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
                        {property.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>
                ))}
              </div>
            </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          {/* Table Header - Sticky */}
          <div className="sticky top-0 z-10 bg-gray-50 border-b">
          <div className="flex">
            {/* Sticky Left Column - Features Header */}
            <div className="w-64 min-w-[16rem] p-4 bg-gray-100 border-r font-semibold text-gray-900 sticky top-0 left-0 z-20">
                <Info className="w-5 h-5 inline mr-2" />
                Features
              </div>
              {/* Property Columns */}
              <div className="flex-1 flex">
                {properties.map((property) => (
                  <div key={property.id} className="flex-1 min-w-[200px] p-4 text-center border-r last:border-r-0">
                    <Link 
                      to={`/houses/${property.slug || property.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="border-b">
            <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 border-b">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Basic Information
              </div>
            </div>
          <div className="flex">
            {/* Sticky Left Label Column */}
            <div className="w-64 min-w-[16rem] p-4 bg-gray-100 border-r space-y-3 sticky left-0 z-10">
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
                <div className="text-sm text-gray-600">Area Size</div>
                <div className="text-sm text-gray-600">Property Type</div>
              </div>
              {/* Property Values */}
              <div className="flex-1 flex">
                {properties.map((property, idx) => (
                  <div key={property.id} className="flex-1 min-w-[200px] p-4 space-y-3 border-r last:border-r-0 text-center">
                    {renderCell(idx, formatPrice(property.price), priceValues)}
                    {renderCell(idx, property.bedrooms, bedroomValues)}
                    {renderCell(idx, property.bathrooms, bathroomValues)}
                    {renderCell(idx, property.area ? `${property.area} sq ft` : null, areaValues)}
                    {renderCell(idx, property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : null, typeValues)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-b">
            <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 border-b">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </div>
            </div>
            <div className="flex">
              <div className="w-64 min-w-[16rem] p-4 bg-gray-100 border-r space-y-3 sticky left-0 z-10">
                <div className="text-sm text-gray-600">City</div>
                <div className="text-sm text-gray-600">Address</div>
              </div>
              <div className="flex-1 flex">
                {properties.map((property, idx) => (
                  <div key={property.id} className="flex-1 min-w-[200px] p-4 space-y-3 border-r last:border-r-0 text-center">
                    {renderCell(idx, property.city, cityValues)}
                    {renderCell(idx, [property.apartment_number, property.street, property.township].filter(Boolean).join(', '), addressValues)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities Section - Provided Amenities */}
          <div className="border-b">
            <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 border-b">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Provided Amenities
              </div>
            </div>
            {(() => {
              const propertyAmenities = properties.map(p => getAmenityNames(p));
              const maxAmenities = Math.max(...propertyAmenities.map(a => a.length), 0);
              
              if (maxAmenities === 0) {
                return (
                  <div className="flex">
                    <div className="w-64 min-w-[16rem] p-4 bg-gray-100 border-r sticky left-0 z-10"></div>
                    <div className="flex-1 flex">
                      {properties.map((property) => (
                        <div key={property.id} className="flex-1 min-w-[200px] p-4 border-r last:border-r-0 text-center text-sm text-gray-500">
                          No amenities available
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div className="flex">
                  <div className="w-64 min-w-[16rem] bg-gray-100 border-r sticky left-0 z-10">
                    {Array.from({ length: maxAmenities }).map((_, idx) => (
                      <div key={idx} className="h-12"></div>
                    ))}
                  </div>
                  <div className="flex-1 flex">
                    {properties.map((property, propIdx) => {
                      const amenities = propertyAmenities[propIdx] || [];
                      return (
                        <div key={property.id} className="flex-1 min-w-[200px] border-r last:border-r-0">
                          {Array.from({ length: maxAmenities }).map((_, amenityIdx) => {
                            const amenityName = amenities[amenityIdx];
                            const IconComponent = amenityName ? getSpecialAmenityIcon(amenityName) : null;
                            return (
                              <div key={amenityIdx} className="h-12 flex items-center justify-center px-2">
                                {amenityName ? (
                                  <span className="text-sm text-gray-700 capitalize flex items-center gap-1.5">
                                    {IconComponent && <IconComponent className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                                    {amenityName}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>


          {/* Property Type & Additional Info */}
          <div>
            <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 border-b">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Additional Details
              </div>
            </div>
             <div className="flex">
               <div className="w-64 min-w-[16rem] p-4 bg-gray-100 border-r space-y-3 sticky left-0 z-10">
                <div className="text-sm text-gray-600">Available From</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              <div className="flex-1 flex">
                {properties.map((property) => (
                  <div key={property.id} className="flex-1 min-w-[200px] p-4 space-y-3 border-r last:border-r-0 text-center">
                    <div className="text-sm text-gray-700">
                      {property.available_from ? new Date(property.available_from).toLocaleDateString() : 'N/A'}
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Explore More Properties
          </Link>
        </div>

        {/* Clear Confirmation Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogHeader>
            <DialogTitle>Clear All Properties</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all properties from the comparison list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)} disabled={isClearing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={isClearing}>
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear All'
              )}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
}
