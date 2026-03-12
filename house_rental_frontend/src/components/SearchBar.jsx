import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center bg-white rounded-full shadow-lg border hover:shadow-xl transition-shadow max-w-4xl w-full">
        <div className="flex-1 px-6 py-3 border-r">
          <label className="block text-xs font-semibold text-gray-900">Where</label>
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="w-full text-sm outline-none text-gray-600 bg-transparent"
          />
        </div>
        <div className="flex-1 px-6 py-3 border-r">
          <label className="block text-xs font-semibold text-gray-900">Check in</label>
          <input 
            type="date" 
            className="w-full text-sm outline-none text-gray-600 bg-transparent"
          />
        </div>
        <div className="flex-1 px-6 py-3 border-r">
          <label className="block text-xs font-semibold text-gray-900">Check out</label>
          <input 
            type="date" 
            className="w-full text-sm outline-none text-gray-600 bg-transparent"
          />
        </div>
        <div className="flex-1 px-6 py-3">
          <label className="block text-xs font-semibold text-gray-900">Who</label>
          <input 
            type="text" 
            placeholder="Add guests" 
            className="w-full text-sm outline-none text-gray-600 bg-transparent"
          />
        </div>
        <button className="m-2 p-3 bg-primary text-white rounded-full hover:opacity-90 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
