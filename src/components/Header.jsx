import React from 'react';
import { Crown } from 'lucide-react';

export function Header({ loading }) {
  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-700/20 rounded-lg border border-amber-700/50 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(180,83,9,0.3)]">
            <Crown size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-neutral-100 tracking-wide font-bold">
              Elden Ring: Nightreign Database
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-neutral-500 text-sm flex items-center gap-2">
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
