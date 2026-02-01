import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-neutral-800 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-neutral-500 text-sm">
          <p className="flex items-center gap-2">
            2026 © bindok. Made with
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            in Adelaide, Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
