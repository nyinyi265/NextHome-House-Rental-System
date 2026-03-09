import React from 'react';
import { Waves, Palmtree, Mountain, TrendingUp, Building2, Snowflake, Trees, Sun } from 'lucide-react';

const categories = [
  { name: 'Amazing pools', icon: Waves },
  { name: 'Beachfront', icon: Palmtree },
  { name: 'Cabins', icon: Mountain },
  { name: 'Trending', icon: TrendingUp },
  { name: 'Castles', icon: Building2 },
  { name: 'Skiing', icon: Snowflake },
  { name: 'Vineyards', icon: Trees },
  { name: 'Tropical', icon: Sun },
];

export default function PropertyTags() {
  const [activeCategory, setActiveCategory] = React.useState('Amazing pools');

  return (
    <div className="sticky top-0 bg-white z-10 py-4 border-b">
      <div className="flex items-center gap-8 overflow-x-auto max-w-7xl mx-auto px-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex flex-col items-center gap-1 min-w-fit p-2 border-b-2 transition-colors ${
                isActive 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
