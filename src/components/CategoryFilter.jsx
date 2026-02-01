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
    <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
      {allCategories.map(category => {
        const Icon = CATEGORY_ICONS[category] || Sparkles;
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border
              ${isActive
                ? 'bg-amber-950/40 text-amber-200 border-amber-700/50 shadow-[0_0_10px_rgba(180,83,9,0.2)]'
                : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 hover:border-neutral-600'
              }
            `}
          >
            <Icon size={16} />
            {category}
          </button>
        );
      })}
    </div>
  );
}
