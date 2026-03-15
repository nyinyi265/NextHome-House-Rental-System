import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Loader2 } from 'lucide-react';
import env from '../environment/environment';

export default function PropertyCard({ id, title, location, city, township, street, price, rating, featured, images = [], house_photos = [] }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  // Resolve images: first try house_photos array (from API), then explicit images prop
  const resolvedImages = (() => {
    const source = house_photos?.length > 0 ? house_photos : images;
    if (!source || !Array.isArray(source)) return [];
    
    return source.map((img) => {
      // Handle both string URLs and objects with photo_path
      if (typeof img === 'string') return img;
      // Use photo_path from API response
      if (img?.photo_path) return env.getImageUrl(img.photo_path);
      // Fallback to photo_url if present
      return img?.photo_url || img?.url || null;
    }).filter(Boolean);
  })();

  // Resolve display location from either a flat `location` prop or address fields from the API
  const displayLocation = location || [township, city].filter(Boolean).join(', ') || street || '';

  const defaultImage = "bg-gradient-to-br from-purple-500 to-blue-500";
  const cardImages = resolvedImages.length > 0 ? resolvedImages : [null];

  const handleCardClick = () => {
    setIsNavigating(true);
    navigate(`/houses/${id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div onClick={handleCardClick} className="group cursor-pointer bg-white rounded-2xl border-2 border-transparent border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]">
      {/* Image Container */}
      <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] mb-2 transition-transform duration-300 ${isNavigating ? 'opacity-50' : ''}`}>
        {/* Loading Overlay - Full card loading like My Rentals */}
        {isNavigating && (
          <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-sm text-gray-600 font-medium">Loading...</span>
          </div>
        )}
        
        <div className={cardImages[0] ? "" : defaultImage + " w-full h-full"}>
          {cardImages[0] && (
            <img
              src={cardImages[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Like Button */}
        <button 
          onClick={handleLikeClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        
        {/* Image Indicator */}
        {cardImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {cardImages.slice(0, 5).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/70" />
            ))}
          </div>
        )}
      </div>
      
      {/* Property Info */}
      <div className="flex justify-between items-start p-4 transition-colors duration-300 group-hover:bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">{displayLocation}</h3>
          <p className="text-gray-500 text-sm">16 kilometers away</p>
          <p className="text-gray-500 text-sm">Feb 27</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-black text-black" />
          <span className="font-medium">{rating}</span>
        </div>
      </div>
      <p className="mt-1">
        <span className="font-semibold text-gray-900">${price}</span>
        <span className="text-gray-900"> / month</span>
      </p>
    </div>
  );
}
