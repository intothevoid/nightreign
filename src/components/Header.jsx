import React from 'react';

export function Header({ loading }) {
  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src="/duchess.png"
            alt="The Duchess - Elden Ring Nightreign"
            className="h-14 w-14 md:h-20 md:w-20 object-cover rounded-lg border-2 border-amber-700/50 shadow-[0_0_20px_rgba(180,83,9,0.4)] hover:scale-105 transition-transform duration-300 flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-serif text-neutral-100 tracking-wide font-bold">
              Elden Ring: Nightreign Database
            </h1>
            <p className="text-sm md:text-base font-serif text-neutral-500 mt-0.5 md:mt-1">by bindok</p>
            <div className="flex items-center gap-3 mt-0.5 md:mt-1">
              <p className="text-neutral-500 text-xs md:text-sm flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full inline-block ${loading ? 'animate-pulse bg-yellow-500' : 'bg-green-500'}`}
                />
                {loading ? 'Loading data...' : 'Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
