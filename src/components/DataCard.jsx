import React from 'react';
import {
  Sparkles, Shield, Sword, Zap, Scroll, Droplet, Skull, Crown
} from 'lucide-react';

const CATEGORY_CONFIG = {
  'Talismans': { icon: Shield, color: 'text-blue-400 border-blue-900/30 bg-blue-900/10', accent: 'bg-blue-600' },
  'Weapons': { icon: Sword, color: 'text-red-400 border-red-900/30 bg-red-900/10', accent: 'bg-red-600' },
  'Stats': { icon: Skull, color: 'text-purple-400 border-purple-900/30 bg-purple-900/10', accent: 'bg-purple-600' },
  'Consumables': { icon: Droplet, color: 'text-emerald-400 border-emerald-900/30 bg-emerald-900/10', accent: 'bg-emerald-600' },
  'Relics': { icon: Scroll, color: 'text-amber-400 border-amber-900/30 bg-amber-900/10', accent: 'bg-amber-600' },
  'Dormant Powers': { icon: Zap, color: 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10', accent: 'bg-yellow-600' },
  'Bosses': { icon: Crown, color: 'text-red-400 border-red-900/30 bg-red-900/10', accent: 'bg-red-600' },
  'Chalices': { icon: Droplet, color: 'text-cyan-400 border-cyan-900/30 bg-cyan-900/10', accent: 'bg-cyan-600' },
  'Other': { icon: Sparkles, color: 'text-neutral-500 border-neutral-800', accent: 'bg-neutral-600' }
};

export function DataCard({ item, searchQuery }) {
  const category = item._category || 'Other';
  const sheetName = item._sheet || 'Unknown';

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
  const Icon = config.icon;

  // Extract display keys (excluding internal metadata)
  const displayKeys = Object.keys(item).filter(key =>
    !key.startsWith('_') &&
    item[key] !== null &&
    item[key] !== undefined &&
    item[key] !== ''
  );

  // Try to find a title (Name, Relic Description, Dormant Power, etc.)
  const title = item.Name ||
                item['Relic Description'] ||
                item['Dormant Power'] ||
                item['Effect Description In-Game'] ||
                item.Category ||
                displayKeys.length > 0 ? item[displayKeys[0]] : 'Unknown Item';

  // Highlight text matching the search query
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const str = String(text);
    const normalizedQuery = query.trim();

    if (normalizedQuery === '') return text;

    const parts = str.split(new RegExp(`(${escapeRegex(normalizedQuery)})`, 'gi'));

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === normalizedQuery.toLowerCase() ? (
            <span key={i} className="bg-amber-900/60 text-amber-200 font-bold px-0.5 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Check if this is a boss (has Health/Poise stats)
  const isBoss = category === 'Bosses' || item.Health || item.Poise;

  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-300 group
      ${isBoss
        ? 'bg-neutral-900/60 border-amber-900/40 hover:border-amber-700/60'
        : 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-600 hover:bg-neutral-900/60'
      }
    `}>
      {/* Accent Line */}
      <div className={`absolute top-0 left-0 w-1 h-full transition-all group-hover:w-1.5 ${config.accent}`} />

      <div className="p-5 pl-7">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="pr-4 flex-1">
            <h3 className={`text-lg font-serif font-bold leading-tight group-hover:text-neutral-100 transition-colors ${isBoss ? 'text-amber-100' : 'text-neutral-200'}`}>
              {highlightText(title, searchQuery)}
            </h3>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <span className="inline-block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {category}
              </span>
              {sheetName !== category && (
                <span className="inline-block text-xs text-neutral-600">
                  • {sheetName}
                </span>
              )}
            </div>
          </div>
          <div className={`p-2 rounded-lg border flex-shrink-0 ${config.color}`}>
            <Icon size={18} />
          </div>
        </div>

        {/* Data Fields */}
        <div className="space-y-2.5">
          {displayKeys.slice(0, 8).map(key => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:justify-between text-sm border-b border-neutral-800/50 pb-1 last:border-0 last:pb-0"
            >
              <span className="text-neutral-500 text-xs font-medium uppercase tracking-wide sm:pt-0.5">
                {key}
              </span>
              <span className={`text-neutral-300 font-medium text-right ${
                key === 'Effect' || key === 'Effect In-Game' || key === 'Effect Description In-Game'
                  ? 'text-amber-100/90'
                  : ''
              }`}>
                {highlightText(item[key], searchQuery)}
              </span>
            </div>
          ))}
          {displayKeys.length > 8 && (
            <p className="text-xs text-neutral-600 italic pt-1 text-right">
              +{displayKeys.length - 8} more fields...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
