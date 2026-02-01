import React from 'react';
import {
  Sparkles, Shield, Sword, Zap, Scroll, Droplet, Skull, Crown
} from 'lucide-react';

const CATEGORY_ICONS = {
  'All': Sparkles,
  'Talismans': Shield,
  'Weapons': Sword,
  'Dormant Powers': Zap,
  'Relics': Scroll,
  'Consumables': Droplet,
  'Stats': Skull,
  'Bosses': Crown,
  'Chalices': Droplet,
  'Other': Sparkles
};

export function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  const allCategories = ['All', ...categories];

  return (
    <div className="flex gap-2 mt-4 md:mt-8 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
      {allCategories.map(category => {
        const Icon = CATEGORY_ICONS[category] || Sparkles;
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap border
              ${isActive
                ? 'bg-amber-950/40 text-amber-200 border-amber-700/50 shadow-[0_0_10px_rgba(180,83,9,0.2)]'
                : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 hover:border-neutral-600'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {category}
          </button>
        );
      })}
    </div>
  );
}
