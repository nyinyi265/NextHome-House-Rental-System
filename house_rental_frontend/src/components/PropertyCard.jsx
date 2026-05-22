import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Loader2, Scale, CheckCircle } from 'lucide-react';
import env from '../environment/environment';
import { useCompare } from '../context/CompareContext';

export default function PropertyCard({ id, slug, title, location, city, township, street, price, rating, featured, available_from, is_available, images = [], house_photos = [] }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const { addToCompare, isInCompare } = useCompare();

  const resolvedImages = (() => {
    const source = house_photos?.length > 0 ? house_photos : images;
    if (!source || !Array.isArray(source)) return [];
    
    return source.map((img) => {
      if (typeof img === 'string') return img;
      if (img?.photo_path) return env.getImageUrl(img.photo_path);
      return img?.photo_url || img?.url || null;
    }).filter(Boolean);
  })();

  const displayLocation = location || [township, city].filter(Boolean).join(', ') || street || '';

  const defaultImage = "bg-gradient-to-br from-purple-500 to-blue-500";
  const cardImages = resolvedImages.length > 0 ? resolvedImages : [null];
  const inCompare = isInCompare(id);

  const handleCardClick = () => {
    setIsNavigating(true);
    navigate(`/houses/${slug || id}`);
  };

  const handleCompareClick = async (e) => {
    e.stopPropagation();
    if (inCompare || isAdding) return;
    
    setIsAdding(true);
    try {
      await addToCompare({ id, title: displayLocation, price });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div onClick={handleCardClick} className="group cursor-pointer bg-white rounded-2xl border-2 border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] relative">
      {/* Compare Button - Top Right Corner */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCompareClick}
          disabled={isAdding}
          title={inCompare ? "Remove from compare" : "Add to compare"}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            inCompare
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

      <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] mb-2 transition-transform duration-300 ${isNavigating ? 'opacity-50' : ''}`}>
        {isNavigating && (
          <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center gap-2">
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

        {/* Available Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              is_available
                ? 'bg-green-100/90 text-green-800'
                : 'bg-red-100/90 text-red-800'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            {is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-start px-4 transition-colors duration-300 group-hover:bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">{title || displayLocation}</h3>
          <p className="text-gray-500 text-sm">Available From: {available_from}</p>
        </div>
        <div className="flex items-center gap-2">
          {rating != null && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-black text-black" />
              <span className="font-medium text-sm">{rating}</span>
            </div>
          )}
        </div>
      </div>
      <p className="my-2 px-4">
        <span className="font-semibold text-gray-900">${price}</span>
        <span className="text-gray-900"> / month</span>
      </p>
    </div>
  );
}
