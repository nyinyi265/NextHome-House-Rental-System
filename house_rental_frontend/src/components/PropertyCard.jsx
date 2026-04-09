import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Loader2 } from 'lucide-react';
import env from '../environment/environment';

export default function PropertyCard({ id, slug, title, location, city, township, street, price, rating, featured, available_from, images = [], house_photos = [] }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

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

  const handleCardClick = () => {
    setIsNavigating(true);
    navigate(`/houses/${slug || id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div onClick={handleCardClick} className="group cursor-pointer bg-white rounded-2xl border-2 border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]">
      <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] mb-2 transition-transform duration-300 ${isNavigating ? 'opacity-50' : ''}`}>
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
      </div>
      
      <div className="flex justify-between items-start px-4 transition-colors duration-300 group-hover:bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">{displayLocation}</h3>
          <p className="text-gray-500 text-sm">Available From: {available_from}</p>
        </div>
      </div>
      <p className="my-2 px-4">
        <span className="font-semibold text-gray-900">${price}</span>
        <span className="text-gray-900"> / month</span>
      </p>
    </div>
  );
}