import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar';
import PropertyTags from '../../components/PropertyTags';
import PropertyCard from '../../components/PropertyCard';
import { PropertyGridSkeleton } from '../../components/Loading';
import { Facebook, Instagram, Twitter, Globe, Shield, CreditCard, Headphones, DollarSign } from 'lucide-react';
import houseService from '../../services/houseService';
import { AuthContext } from '../../context/AuthContext';

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description: 'All listings are checked for quality and accuracy.',
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Safe transactions with full protection.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock help for any issue.',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    description: 'Competitive pricing on all rentals.',
    bgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

const nearbyDestinations = [
  {
    name: 'Bali',
    properties: 5000,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop',
  },
  {
    name: 'Los Angeles',
    properties: 4500,
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400&h=300&fit=crop',
  },
  {
    name: 'Miami',
    properties: 3800,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    name: 'London',
    properties: 5200,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
  },
  {
    name: 'Paris',
    properties: 4100,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
  },
  {
    name: 'Tokyo',
    properties: 3600,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
  },
];

function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between items-center py-4 border-b">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>© 2026 NextHome, Inc.</span>
            <span className="text-gray-300">|</span>
            <button type="button" className="hover:underline text-gray-600 bg-transparent border-none p-0 cursor-pointer text-sm">Terms</button>
            <span className="text-gray-300">|</span>
            <button type="button" className="hover:underline text-gray-600 bg-transparent border-none p-0 cursor-pointer text-sm">Sitemap</button>
            <span className="text-gray-300">|</span>
            <button type="button" className="hover:underline text-gray-600 bg-transparent border-none p-0 cursor-pointer text-sm">Privacy</button>
            <span className="text-gray-300">|</span>
            <button type="button" className="hover:underline text-gray-600 bg-transparent border-none p-0 cursor-pointer text-sm">Your Privacy Choices</button>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>$</span>
              <span>USD</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="text-gray-600 hover:text-gray-900 bg-transparent border-none p-0 cursor-pointer">
                <Facebook className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-600 hover:text-gray-900 bg-transparent border-none p-0 cursor-pointer">
                <Twitter className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-600 hover:text-gray-900 bg-transparent border-none p-0 cursor-pointer">
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 text-xs text-gray-500">
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">About</button>
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">Help Center</button>
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">AirCover</button>
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">Anti-discrimination</button>
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">Disability support</button>
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">Cancellation options</button>
          <button type="button" className="hover:underline bg-transparent border-none p-0 cursor-pointer text-gray-500 text-xs">Report neighborhood concern</button>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { token, user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = (() => {
    if (!user) return null;
    if (user.role) return user.role;
    if (user.roles && user.roles.length) return user.roles[0].name;
    return null;
  })();

  useEffect(() => {
    setLoading(true);
    houseService
      .list(token, role)
      .then((response) => {
        let housesData = [];
        
        // Laravel paginator wrapped in HouseResponse::list()
        const housesWrapper = response.data?.houses || response.houses;
        
        // Handle paginated response - paginator has 'data' property
        if (housesWrapper?.data) {
          housesData = housesWrapper.data;
        } else if (Array.isArray(housesWrapper)) {
          housesData = housesWrapper;
        } else if (Array.isArray(response.data)) {
          housesData = response.data;
        } else if (Array.isArray(response)) {
          housesData = response;
        }
        
        setProperties(housesData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch houses', err);
        setError(err.message || 'Unable to load properties');
      })
      .finally(() => setLoading(false));
  }, [token, role]);

  const featuredProperties = properties.slice(0, 4);
  console.log('Featured properties:', featuredProperties);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-blue-900/60" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find your next adventure
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Discover unique homes and experiences around the world
          </p>
          <div className="w-full max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
          <p className="text-lg text-gray-500">We make your rental experience simple and secure</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-2 border-primary"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${item.bgColor} mb-4`}>
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Properties</h2>
        {loading ? (
          <PropertyGridSkeleton count={3} />
        ) : error ? (
          <div className="text-red-500 py-4 text-center">{error}</div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-gray-400 py-4 text-center">No featured properties available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} {...p} featured />
            ))}
          </div>
        )}
      </div>

      {/* All Properties */}
      {/* <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Listings</h2>
        {loading ? (
          <PropertyGridSkeleton count={8} />
        ) : error ? (
          <div className="text-red-500 py-4 text-center">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-gray-400 py-4 text-center">No listings available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div> */}

      {/* Nearby Destinations */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nearby destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {nearbyDestinations.map((dest) => (
            <div key={dest.name} className="cursor-pointer group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop';
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-900">{dest.name}</h3>
              <p className="text-sm text-gray-500">{dest.properties.toLocaleString()} properties</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call-To-Action */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start renting your property today
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Earn money by listing your space and reaching thousands of renters.
          </p>
          <button className="px-8 py-3 bg-white text-primary font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-50">
            List Your Property
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
