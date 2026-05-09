import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import FilterSidebar from '../../components/FilterSidebar';
import PropertyCard from '../../components/PropertyCard';
import { PropertyGridSkeleton } from '../../components/Loading';
import { Search, MapPin, LayoutGrid, List, Bed, Bath, Maximize, Loader2, Star, Scale } from 'lucide-react';
import houseService from '../../services/houseService';
import { AuthContext } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import env from '../../environment/environment';

function PropertyListItem({ property }) {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCompare, isInCompare } = useCompare();

  const photos = property.house_photos || property.images || [];
  const resolvedImage =
    photos.length > 0
      ? typeof photos[0] === 'string'
        ? photos[0]
        : env.getImageUrl(photos[0].photo_path) || photos[0].photo_url
      : null;

  const displayLocation =
    property.location ||
    [property.township, property.city].filter(Boolean).join(', ') ||
    property.street ||
    '';

  const handleClick = () => {
    setIsNavigating(true);
    navigate(`/houses/${property.slug || property.id}`);
  };

  const handleCompareClick = async (e) => {
    e.stopPropagation();
    if (isAdding || isInCompare(property.id)) return;
    
    setIsAdding(true);
    try {
      await addToCompare({ id: property.id, title: displayLocation, price: property.price });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all duration-300 relative"
    >
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center gap-2 rounded-xl">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-sm text-gray-600 font-medium">Loading...</span>
        </div>
      )}

      {/* Compare Button */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={handleCompareClick}
          disabled={isAdding}
          title={isInCompare(property.id) ? "Remove from compare" : "Add to compare"}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isInCompare(property.id)
              ? 'bg-primary/90 text-white hover:bg-primary hover:scale-110'
              : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
          } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Scale className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Image - Left Side */}
        <div className="relative sm:w-72 md:w-80 flex-shrink-0">
          <div className="aspect-[4/3] sm:aspect-auto sm:h-full w-full overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none bg-gray-200">
            {resolvedImage ? (
              <img
                src={resolvedImage}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-4xl opacity-60">🏠</span>
              </div>
            )}
          </div>
          {/* Photo Count Badge */}
          {photos.length > 1 && (
            <span className="absolute bottom-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
              {photos.length} photos
            </span>
          )}
          {/* Status Badge */}
          {property.is_available != null && (
            <span
              className={`absolute top-14 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                property.is_available
                  ? 'bg-green-100/90 text-green-800'
                  : 'bg-gray-100/90 text-gray-800'
              }`}
            >
              {property.is_available ? 'Available' : 'Unavailable'}
            </span>
          )}
        </div>

        {/* Details - Right Side */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                  {property.title || displayLocation}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {displayLocation}
                </p>
              </div>
              {property.rating != null && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="font-medium text-sm">{property.rating}</span>
                </div>
              )}
            </div>

            {/* Property Type Badge */}
            {property.type && (
              <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize mb-3">
                {property.type}
              </span>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {property.bedrooms != null && (
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span>{property.bedrooms} beds</span>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span>{property.bathrooms} baths</span>
                </div>
              )}
              {property.area != null && (
                <div className="flex items-center gap-1.5">
                  <Maximize className="w-4 h-4 text-gray-400" />
                  <span>{property.area} sq ft</span>
                </div>
              )}
            </div>

            {/* Description Snippet */}
            {property.description && (
              <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                {property.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div>
              <span className="font-bold text-gray-900 text-lg">
                ${property.price || property.price_per_month}
              </span>
              <span className="text-sm text-gray-500"> / month</span>
            </div>
            {property.city && (
              <span className="text-sm text-gray-400">{property.city}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { token, user } = useContext(AuthContext);

  const role = (() => {
    if (!user) return null;
    if (user.role) return user.role;
    if (user.roles && user.roles.length) return user.roles[0].name;
    return null;
  })();

  useEffect(() => {
    setLoading(true);
    const filtersWithPage = { ...filters, page, per_page: 12 };
    houseService
      .list(token, role, filtersWithPage)
      .then((response) => {
        let housesData = [];
        
        // Laravel paginator wrapped in HouseResponse::list()
        const housesWrapper = response.data?.houses || response.houses;
        
        // Handle paginated response - paginator has 'data' property
        if (housesWrapper?.data) {
          housesData = housesWrapper.data;
          setTotalPages(housesWrapper.last_page || 1);
          setTotalCount(housesWrapper.total || housesData.length);
        } else if (Array.isArray(housesWrapper)) {
          housesData = housesWrapper;
          setTotalPages(1);
          setTotalCount(housesData.length);
        } else if (Array.isArray(response.data)) {
          housesData = response.data;
          setTotalPages(1);
          setTotalCount(housesData.length);
        } else if (Array.isArray(response)) {
          housesData = response;
          setTotalPages(1);
          setTotalCount(housesData.length);
        } else {
          housesData = [];
          setTotalCount(0);
        }
        
        setProperties(housesData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch houses', err);
        setError(err.message || 'Unable to load properties');
      })
      .finally(() => setLoading(false));
  }, [token, role, filters, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, city: searchQuery });
  };

  const filteredProperties = properties.filter((p) => p.is_available !== 0 && p.is_available !== false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Search and Filter Bar */}
      <div className="sticky top-0 bg-white z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Search Input */}
            <form
              onSubmit={handleSearch}
              className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 hover:shadow-md transition-shadow"
            >
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search by city or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Results Count + Layout Toggle */}
      <div className="py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {/* {`${filteredProperties.length} properties found`} */}
            </div>
            <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 transition-colors ${
                  layout === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 transition-colors ${
                  layout === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar - Always visible on desktop */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Properties */}
          <div className="flex-1">
            {loading && layout === 'grid' && (
              <PropertyGridSkeleton count={6} />
            )}
            {loading && layout === 'list' && (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border overflow-hidden animate-pulse"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-72 md:w-80 flex-shrink-0">
                        <div className="aspect-[4/3] sm:aspect-auto sm:h-48 bg-gray-200 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none" />
                      </div>
                      <div className="flex-1 p-5 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="flex gap-4">
                          <div className="h-4 bg-gray-200 rounded w-20" />
                          <div className="h-4 bg-gray-200 rounded w-20" />
                        </div>
                        <div className="pt-3 border-t mt-auto">
                          <div className="h-5 bg-gray-200 rounded w-28" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="text-red-500 py-4 text-center">{error}</div>
            )}
            {!loading && !error && filteredProperties.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No properties found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
            {!loading && !error && filteredProperties.length > 0 && layout === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id} {...p} />
                ))}
              </div>
            )}
            {!loading && !error && filteredProperties.length > 0 && layout === 'list' && (
              <div className="space-y-4">
                {filteredProperties.map((p) => (
                  <PropertyListItem key={p.id} property={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
