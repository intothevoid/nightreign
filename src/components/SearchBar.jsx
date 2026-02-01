import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="mt-4 md:mt-8 relative max-w-4xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 md:pl-5 flex items-center pointer-events-none">
        <Search className="h-5 w-5 md:h-6 md:w-6 text-neutral-500" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 md:pl-14 pr-10 md:pr-12 py-3 md:py-4 bg-neutral-900/80 border border-neutral-700 rounded-xl md:rounded-2xl text-base md:text-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 transition-all shadow-2xl"
        placeholder="Search for effects, items, stats..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-2 md:right-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <X className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
    </div>
  );
}
