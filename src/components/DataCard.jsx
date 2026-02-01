import React, { useState } from 'react';
import {
  Sparkles, Shield, Sword, Zap, Scroll, Droplet, Skull, Crown, ChevronDown, ChevronUp
} from 'lucide-react';

const CATEGORY_CONFIG = {
  'Talismans': { icon: Shield, color: 'text-blue-400 border-blue-900/30 bg-blue-900/10', accent: 'bg-blue-600' },
  'Weapons': { icon: Sword, color: 'text-red-400 border-red-900/30 bg-red-900/10', accent: 'bg-red-600' },
  'Stats': { icon: Skull, color: 'text-purple-400 border-purple-900/30 bg-purple-900/10', accent: 'bg-purple-600' },
  'Levels': { icon: Skull, color: 'text-indigo-400 border-indigo-900/30 bg-indigo-900/10', accent: 'bg-indigo-600' },
  'Consumables': { icon: Droplet, color: 'text-emerald-400 border-emerald-900/30 bg-emerald-900/10', accent: 'bg-emerald-600' },
  'Relics': { icon: Scroll, color: 'text-amber-400 border-amber-900/30 bg-amber-900/10', accent: 'bg-amber-600' },
  'Dormant Powers': { icon: Zap, color: 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10', accent: 'bg-yellow-600' },
  'Nightlord Stats': { icon: Crown, color: 'text-red-400 border-red-900/30 bg-red-900/10', accent: 'bg-red-600' },
  'Everdark Sovereign Stats': { icon: Crown, color: 'text-purple-400 border-purple-900/30 bg-purple-900/10', accent: 'bg-purple-600' },
  'Chalices': { icon: Droplet, color: 'text-cyan-400 border-cyan-900/30 bg-cyan-900/10', accent: 'bg-cyan-600' },
  'Other': { icon: Sparkles, color: 'text-neutral-500 border-neutral-800', accent: 'bg-neutral-600' }
};

// Mapping of sheet names to their title column
const SHEET_TITLE_COLUMN = {
  'Weapon Effects': 'Effect Description In-Game',
  'Deep Weapon Effects': 'Effect Description In-Game',
  'Relic Effects': 'Relic Description',
  'Deep Relic Effects': 'Relic Description',
  'Dormant Powers': 'Dormant Power'
};

export function DataCard({ item, searchQuery }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const category = item._category || 'Other';
  const sheetName = item._sheet || 'Unknown';

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
  const Icon = config.icon;

  // Determine the title column for this sheet
  const titleColumn = SHEET_TITLE_COLUMN[sheetName];

  // Extract title from the designated column or fallback to Name
  const title = titleColumn && item[titleColumn]
    ? item[titleColumn]
    : item.Name || (Object.keys(item).find(key => !key.startsWith('_')) ? item[Object.keys(item).find(key => !key.startsWith('_'))] : 'Unknown Item');

  // Extract display keys (excluding internal metadata and title column)
  const displayKeys = Object.keys(item).filter(key =>
    !key.startsWith('_') &&
    key !== titleColumn &&  // Exclude title column from body
    item[key] !== null &&
    item[key] !== undefined &&
    item[key] !== ''
  );

  const hasMoreFields = displayKeys.length > 8;
  const fieldsToShow = isExpanded ? displayKeys : displayKeys.slice(0, 8);

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

  // Check if this is a boss (has Health/Poise stats or is in boss categories)
  const isBoss = category === 'Nightlord Stats' || category === 'Everdark Sovereign Stats' || item.Health || item.Poise;

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
          {fieldsToShow.map(key => (
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
          {hasMoreFields && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-xs text-neutral-500 hover:text-neutral-300 italic pt-1 flex items-center justify-end gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp size={14} />
                </>
              ) : (
                <>
                  +{displayKeys.length - 8} more fields...
                  <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
