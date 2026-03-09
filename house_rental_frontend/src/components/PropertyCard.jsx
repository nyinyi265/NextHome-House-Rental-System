import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

export default function PropertyCard({ id, title, location, city, township, street, price, rating, featured, images = [], house_photos = [] }) {
  const [isLiked, setIsLiked] = useState(false);

  // Resolve images: accept explicit `images` prop, fall back to `house_photos` from API,
  // then extract the `photo_url` or `url` string from each photo object.
  const resolvedImages = (() => {
    const source = images.length > 0 ? images : house_photos;
    return source.map((img) => {
      if (typeof img === 'string') return img;
      return img?.photo_url || img?.url || null;
    }).filter(Boolean);
  })();

  // Resolve display location from either a flat `location` prop or address fields from the API
  const displayLocation = location || [township, city].filter(Boolean).join(', ') || street || '';

  const defaultImage = "bg-gradient-to-br from-purple-500 to-blue-500";
  const cardImages = resolvedImages.length > 0 ? resolvedImages : [null];

  return (
    <Link to={`/houses/${id}`} className="no-underline text-inherit">
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-2">
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
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
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
        <div className="flex justify-between items-start">
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
    </Link>
  );
}
