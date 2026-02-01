import React, { useState, useEffect, useMemo } from 'react';
import { Search, Upload, FileText, X, Filter, Info, Shield, Sword, Sparkles, Skull, Scroll, Zap, Crosshair, Droplet, Heart, Ghost, Crown, AlertTriangle, Database } from 'lucide-react';

// --- Utility: Load Script for SheetJS ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// --- PRE-LOADED DATA (FALLBACK) ---
// Expanded with data from your CSVs including "Attack Power" entries
const PRELOADED_DATA = {
  talismans: [
    { Name: "Ancestral Spirit's Horn", Effect: "Restores 5% of max FP when an enemy is killed", "In-Game": "Defeating enemies restores FP" },
    { Name: "Arrow's Reach Talisman", Effect: "Increases bowDistRate by 50", "In-Game": "Projectile damage drop-off reduced" },
    { Name: "Arrow's Sting Talisman", Effect: "Increases arrow / bolt damage by 1.14x", "In-Game": "Improved ranged weapon attacks" },
    { Name: "Assassin's Cerulean Dagger", Effect: "Restores 10% of max FP on critical hits", "In-Game": "Critical hit FP restoration" },
    { Name: "Assassin's Crimson Dagger", Effect: "Restores 18% of max FP on critical hits", "In-Game": "Critical hit HP restoration" },
    { Name: "Axe Talisman", Effect: "Increases charged heavy damage by 1.12x", "In-Game": "Improved charge attacks" },
    { Name: "Blessed Dew Talisman", Effect: "Increases HP recovery by 2/s", "In-Game": "Continuous HP recovery" },
    { Name: "Blue-Feathered Branchsword", Effect: "Increases damage negation by 40% when HP is below 40%", "In-Game": "Improved damage negation at low HP" },
    { Name: "Boltdrake Talisman", Effect: "Increases lightning damage negation by 20%", "In-Game": "Improved lightning damage negation" },
    { Name: "Bull-Goat's Talisman", Effect: "Decreases incoming poise damage by 0.75x", "In-Game": "Improved poise" },
    { Name: "Carian Filigreed Crest", Effect: "Reduces FP cost of skills by 0.75x", "In-Game": "Reduced skill FP cost" },
    { Name: "Cerulean Amber Medallion", Effect: "Increases FP by 1.12x", "In-Game": "Increased maximum FP" },
    { Name: "Clarifying Horn Charm", Effect: "Increases sleep and madness resist by 75", "In-Game": "Improved sleep and madness resistance" },
    { Name: "Claw Talisman", Effect: "Increases jump attack damage by 1.12x", "In-Game": "Improved jump attacks" },
    { Name: "Companion Jar", Effect: "Increases damage of pots by 1.2x", "In-Game": "Improved throwing pots" },
    { Name: "Lord Talisman", Effect: "Increases damage by 1.1x when HP is at 100%", "In-Game": "Improved attack power at full HP" },
    { Name: "Roar Medallion", Effect: "Increased damage of roar and breath attacks by 1.2x", "In-Game": "Improved roar & breath attacks" },
    { Name: "Sacred Scorpion Charm", Effect: "Increases holy damage by 1.15x / -10% phys neg", "In-Game": "Improved holy attack power" },
    { Name: "Sacrificial Twig", Effect: "Prevents rune loss on death", "In-Game": "No rune loss or level down upon death" },
    { Name: "Silver Scarab", Effect: "Increases discovery by 40", "In-Game": "Improved item discovery" },
    { Name: "Spear Talisman", Effect: "Increases counterhit damage by 1.2x", "In-Game": "Improved thrusting counterattack" },
    { Name: "Spelldrake Talisman", Effect: "Increases magic damage negation by 20%", "In-Game": "Improved magic damage negation" },
    { Name: "Stalwart Horn Charm", Effect: "Increases blood loss and frost resist by 75", "In-Game": "Improved blood loss and frost resistance" },
    { Name: "Symbol of Avarice", Effect: "Inc. discovery 60, runes 20%, reduces HP 10/s", "In-Game": "Improved discovery & runes, HP loss" },
    { Name: "Taker's Cameo", Effect: "Restores 6% of max HP when an enemy is killed", "In-Game": "Defeating enemies restores HP" },
    { Name: "Twinblade Talisman", Effect: "Increases damage by 1.15x with final chain hit", "In-Game": "Improved chain attack finishers" },
    { Name: "Viridian Amber Medallion", Effect: "Increases stamina by 1.12x", "In-Game": "Increased maximum stamina" },
    { Name: "Warrior Jar Shard", Effect: "Increases damage of skills by 1.15x", "In-Game": "Improved skill attack power" },
    { Name: "Winged Sword Insignia", Effect: "Increases damage by 1.03x-1.13x on successive hits", "In-Game": "Successive attacks boost attack power" }
  ],
  weapons: [
    { Name: "The Wylder's Grief", Effect: "Increases strength and dexterity by 3/6/9", Category: "Stat" },
    { Name: "The Guardian's Grief", Effect: "Increases vigor and endurance by 3/6/9", Category: "Stat" },
    { Name: "The Ironeye's Grief", Effect: "Increases endurance and dexterity by 3/6/9", Category: "Stat" },
    { Name: "The Duchess' Grief", Effect: "Increases dexterity and intelligence by 3/6/9", Category: "Stat" },
    { Name: "The Raider's Grief", Effect: "Increases vigor and strength by 3/6/9", Category: "Stat" },
    { Name: "The Revenant's Grief", Effect: "Increases faith and arcane by 3/6/9", Category: "Stat" },
    { Name: "The Recluse's Grief", Effect: "Increases mind and intelligence by 3/6/9", Category: "Stat" },
    { Name: "The Executor's Grief", Effect: "Increases dexterity and arcane by 3/6/9", Category: "Stat" },
    { Name: "The Scholar's Grief", Effect: "Increases intelligence and arcane by 3/6/9", Category: "Stat" },
    { Name: "The Undertaker's Grief", Effect: "Increases strength and faith by 3/6/9", Category: "Stat" },
    { Name: "Improved Item Discovery", Effect: "Increases discovery by 20 / 30 / 40", Category: "Exploration" },
    { Name: "Dual Wield Attack Up", Effect: "Increases paired L1 damage by 1.12x / 1.15x", Category: "Offensive" },
    { Name: "Guard Boost Dmg Negation", Effect: "Increases damage negation by 14-24% after block", Category: "Defensive" },
    { Name: "Guard Boost Poise", Effect: "Reduces incoming poise dmg by 0.88x-0.76x after block", Category: "Defensive" },
    { Name: "Power of the Golden Order", Effect: "Charge attacks heal all ailments", Category: "Defensive" },
    { Name: "Continuous HP Recovery", Effect: "Recovers 1 HP/s", Category: "Regen" },
    { Name: "HP Restoration on Hit", Effect: "Restores 4/6/8 HP on continuous attacks", Category: "Regen" },
    { Name: "Defeating Enemies Restores HP", Effect: "Restores 20/30/40 HP on kill", Category: "Regen" },
    { Name: "Curse: Impaired Dmg Negation", Effect: "Increases phys damage taken by 5.5%/8%", Category: "Deep Weapon Effect" },
    { Name: "Curse: More Dmg After Evasion", Effect: "Increases damage taken by 15%/20% after roll", Category: "Deep Weapon Effect" },
    { Name: "Curse: Night's Tide", Effect: "Increases damage taken by Night's Tide by 2x/2.5x", Category: "Deep Weapon Effect" }
  ],
  dormantPowers: [
     { Name: "Improved Physical Attack Power", Effect: "Increases physical damage by 1.06x / 1.09x", Category: "Offensive", "In-Game": "Raises physical attack" },
     { Name: "Improved Affinity Attack Power", Effect: "Increases magic, fire, lightning, and holy damage by 1.05x / 1.08x", Category: "Offensive", "In-Game": "Raises attacks of magic, fire, lightning, holy affinities" },
     { Name: "Improved Perfuming Arts", Effect: "Increases the damage of perfume items by 1.2x", Category: "Offensive", "In-Game": "Raises potency of items employing perfume" },
     { Name: "Improved Throwing Pots", Effect: "Increases the damage of pot items by 1.2x", Category: "Offensive", "In-Game": "Raises potency of throwing pots" },
     { Name: "Fire Attack Power Up +2", Effect: "Increases fire attack power (value varies)", Category: "Offensive", "In-Game": "Boosts Fire Attack Power" },
     { Name: "Attack power up when facing frostbite-afflicted enemy", Effect: "Damage increased against frostbitten enemies", Category: "Offensive", "In-Game": "Attack power up vs Frostbite" },
     { Name: "Physical Attack Up +3/4", Effect: "Increases physical damage by 1.105x / 1.12x", Category: "Deep Relic", "In-Game": "Physical Attack Up" },
     { Name: "[Element] Attack Up +3/4", Effect: "Increases magic/fire/lightning/holy damage by 1.105x / 1.12x", Category: "Deep Relic", "In-Game": "Elemental Attack Up" },
     { Name: "Improved Bow Attack Power", Effect: "Increases bow damage", Category: "Offensive", "In-Game": "Improved Bow Attack Power" },
     { Name: "Improved Colossal Weapon Attack Power", Effect: "Increases colossal weapon damage", Category: "Offensive", "In-Game": "Improved Colossal Weapon Attack Power" },
     { Name: "Taking attacks improves attack power", Effect: "Getting hit boosts attack power momentarily", Category: "Offensive", "In-Game": "Taking attacks improves attack power" }
  ],
  consumables: [
    { Name: "Acid Spraymist", Effect: "Decreases enemy physical damage dealt by 0.85x", Duration: "60s" },
    { Name: "Bloodboil Aromatic", Effect: "Phys Dmg 1.35x, Max Stam 1.2x, Dmg Neg -35%", Duration: "60s" },
    { Name: "Boiled Crab", Effect: "Increases physical damage negation by 20%", Duration: "60s" },
    { Name: "Boiled Prawn", Effect: "Increases physical damage negation by 15%", Duration: "60s" },
    { Name: "Cerulean Crystal Tear", Effect: "Restores all FP", Duration: "Instant" },
    { Name: "Cerulean Hidden Tear", Effect: "Eliminates all FP consumption", Duration: "15s" },
    { Name: "Crimson Bubbletear", Effect: "Restores 30% HP when below 21%", Duration: "120s" },
    { Name: "Crimson Crystal Tear", Effect: "Restores 50% HP", Duration: "Instant" },
    { Name: "Crimsonburst Crystal Tear", Effect: "Increases HP recovery by 7/s", Duration: "120s" },
    { Name: "Pickled Turtle Neck", Effect: "Increases stamina recovery by 10/s", Duration: "60s" },
    { Name: "Shield Grease", Effect: "Inc. Dmg Neg 20%, Reduces Stam Dmg 0.87x", Duration: "60s" },
    { Name: "Silver-Pickled Fowl Foot", Effect: "Increases discovery by 30", Duration: "60s" },
    { Name: "Speckled Hardtear", Effect: "Increases status resist by 90 & heals status", Duration: "120s" },
    { Name: "Spiked Crystal Tear", Effect: "Increases charged heavy damage by 1.15x", Duration: "120s" },
    { Name: "Starlight Shards", Effect: "Restores 60% of Max FP", Duration: "Instant" },
    { Name: "Stonebarb Cracked Tear", Effect: "Increases poise damage by 1.3x", Duration: "30s" },
    { Name: "Thorny Cracked Tear", Effect: "Inc. damage on continuous attacks (up to 1.48x)", Duration: "120s" },
    { Name: "Twiggy Cracked Tear", Effect: "Prevents rune loss on death", Duration: "120s" },
    { Name: "Uplifting Aromatic", Effect: "Phys Dmg 1.1x, Dmg Neg 90% (1 hit)", Duration: "40s" },
    { Name: "Warming Stone", Effect: "Recovers 25 HP/s for allies", Duration: "30s" }
  ],
  relics: [
    { Name: "Stat Bonus (Vigor/Mind/End)", Effect: "+20 HP / +5 FP / +2 Stamina per level", Category: "Stat" },
    { Name: "Stat Bonus (Attributes)", Effect: "+1 Stat per level (3 Arc adds 5.4% bleed)", Category: "Stat" },
    { Name: "Poise Bonus", Effect: "Reduces poise dmg by 0.95x/0.9x/0.85x", Category: "Stat" },
    { Name: "Max FP (Staves)", Effect: "+50 Max FP if 3+ Staves equipped", Category: "Stat" },
    { Name: "Max HP (Shields)", Effect: "+200 Max HP if 3+ Shields equipped", Category: "Stat" },
    { Name: "Undertaker Ultimate", Effect: "Increases damage by 1.18x for 40s", Category: "Character" },
    { Name: "Scholar Analyze", Effect: "Slows decay rate of Analyze meter", Category: "Character" },
    { Name: "Start: Element Dmg", Effect: "Lowers Phys AP, Adds Elemental AP to starter", Category: "Start of Game" },
    { Name: "Deep: Max HP", Effect: "Increases Max HP by 1.1x", Category: "Deep Relic" },
    { Name: "Deep: Max FP", Effect: "Increases Max FP by 1.15x", Category: "Deep Relic" },
    { Name: "Deep: Max Stamina", Effect: "Increases Max Stamina by 1.12x", Category: "Deep Relic" },
    { Name: "Curse: Reduced Stats", Effect: "-3 to specific stats", Category: "Curse" },
    { Name: "Curse: Reduced Flask", Effect: "Reduces HP gained from flasks by 0.85x", Category: "Curse" },
    { Name: "Curse: HP Loss", Effect: "Decreases HP by 2/s", Category: "Curse" },
    { Name: "Physical Attack Up", Effect: "Increases physical attack", Category: "Guaranteed Relic" }
  ],
  stats: [
    { Name: "Wylder", Level: "15", Vigor: "52", Mind: "19", Endurance: "27", Str: "50", Dex: "40", Int: "15", Fth: "15", Arc: "10" },
    { Name: "Guardian", Level: "15", Vigor: "60", Mind: "14", Endurance: "38", Str: "41", Dex: "31", Int: "10", Fth: "21", Arc: "10" },
    { Name: "Ironeye", Level: "15", Vigor: "37", Mind: "14", Endurance: "28", Str: "19", Dex: "57", Int: "7", Fth: "13", Arc: "13" },
    { Name: "Executor", Level: "8", Vigor: "29", Mind: "6", Endurance: "16", Str: "16", Dex: "44", Int: "5", Fth: "4", Arc: "28" },
    { Name: "Gladius, Beast of Night", Health: "33984", Poise: "400", "Phys Neg": "Standard", "Holy Neg": "50", Notes: "Trio Stats" },
    { Name: "Adel, Baron of Night", Health: "49278", Poise: "500", "Phys Neg": "Standard", "Holy Neg": "20", Notes: "Trio Stats" },
    { Name: "Gnoster, Wisdom of Night", Health: "23448", Poise: "333", "Phys Neg": "-15", "Holy Neg": "50", Notes: "Trio Stats" },
    { Name: "Faurtis Stoneshield", Health: "39081", Poise: "500", "Phys Neg": "100 (Shield)", "Holy Neg": "10", Notes: "Trio Stats" },
    { Name: "Maris, Fathom of Night", Health: "38061", Poise: "500", "Phys Neg": "Standard", "Holy Neg": "20", Notes: "Trio Stats" }
  ]
};

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'talismans', label: 'Talismans', icon: Shield },
  { id: 'weapons', label: 'Weapons', icon: Sword },
  { id: 'dormantPowers', label: 'Dormant Powers', icon: Zap },
  { id: 'relics', label: 'Relics', icon: Scroll },
  { id: 'consumables', label: 'Consumables', icon: Droplet },
  { id: 'stats', label: 'Stats & Bosses', icon: Skull },
];

export default function App() {
  const [data, setData] = useState(PRELOADED_DATA);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [isServerMode, setIsServerMode] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // --- Initialize SheetJS & Auto-Load ---
  useEffect(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
      .then(() => {
        console.log("SheetJS loaded. Attempting to fetch local data.xlsx...");
        fetchLocalExcel();
      })
      .catch(err => console.error("Failed to load SheetJS", err));
  }, []);

  // --- Fetch local file for hosting environment ---
  const fetchLocalExcel = async () => {
    try {
      const response = await fetch('data.xlsx'); // User must rename their file to this
      if (!response.ok) throw new Error('No local data.xlsx found');
      
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = window.XLSX.read(e.target.result, { type: 'binary' });
        processWorkbook(wb);
        setIsServerMode(true);
      };
      reader.readAsBinaryString(blob);
    } catch (err) {
      console.log("Running in preview mode (using preloaded data).");
    }
  };

  const processWorkbook = (wb) => {
    const newData = {};
    wb.SheetNames.forEach(sheetName => {
      const ws = wb.Sheets[sheetName];
      const json = window.XLSX.utils.sheet_to_json(ws);
      
      // Map sheets to categories intelligently
      const lowerName = sheetName.toLowerCase();
      let category = 'misc';
      if (lowerName.includes('talisman')) category = 'talismans';
      else if (lowerName.includes('weapon') && !lowerName.includes('deep')) category = 'weapons';
      else if (lowerName.includes('dormant') || lowerName.includes('deep')) category = 'dormantPowers';
      else if (lowerName.includes('relic') && !lowerName.includes('deep')) category = 'relics';
      else if (lowerName.includes('consumable')) category = 'consumables';
      else if (lowerName.includes('stat') || lowerName.includes('level')) category = 'stats';
      else category = 'relics'; // Fallback for things like "Guaranteed Relics"

      if (!newData[category]) newData[category] = [];
      newData[category] = [...newData[category], ...json];
    });
    setData(newData);
    setLoadedFiles(prev => [...prev, 'data.xlsx']);
  };

  // --- Handlers ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleManualUpload = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    if (!window.XLSX) {
      setLoadError("Parsing library not ready. Please wait a moment.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (file.name.endsWith('.xlsx')) {
            const wb = window.XLSX.read(e.target.result, { type: 'binary' });
            processWorkbook(wb);
          } else if (file.name.endsWith('.csv')) {
             // Basic CSV fallback if XLSX lib fails or simple parse needed
             const text = e.target.result; // Would need text reader
             // Re-using the manual logic implies text read, but binary read is standard for XLSX lib
             // For simplicity in this hybrid mode, we assume XLSX lib handles CSV too if we read as text
             // But let's stick to XLSX for .xlsx and our basic parser for .csv if we wanted strictly.
             // Actually, XLSX.read handles CSV strings too if type is 'string'.
             const wb = window.XLSX.read(text, { type: 'binary' }); // Might need 'string' type
             processWorkbook(wb);
          }
        } catch (err) {
          console.error("Parse error", err);
          setLoadError(`Failed to parse ${file.name}`);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  // --- Search Logic ---
  const filteredData = useMemo(() => {
    const term = searchQuery.toLowerCase();
    
    // Helper to search an object recursively or deeply
    const matches = (item) => Object.entries(item).some(([key, val]) => {
      // Skip internal keys
      if (key.startsWith('_')) return false;
      return String(val).toLowerCase().includes(term);
    });

    let results = [];

    // If specific category selected
    if (activeCategory !== 'all') {
      if (data[activeCategory]) {
        results = data[activeCategory]
          .filter(matches)
          .map(item => ({ ...item, _category: activeCategory }));
      }
    } else {
      // Aggregate all
      Object.keys(data).forEach(cat => {
        const catResults = data[cat]
          .filter(matches)
          .map(item => ({ ...item, _category: cat }));
        results = [...results, ...catResults];
      });
    }

    return results;
  }, [data, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-amber-900 selection:text-white pb-20">
      
      {/* Header & Hero */}
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-700/20 rounded-lg border border-amber-700/50 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(180,83,9,0.3)]">
                <Crown size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-neutral-100 tracking-wide font-bold">Nightreign Database</h1>
                <div className="flex items-center gap-3">
                  <p className="text-neutral-500 text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${isServerMode ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                    {isServerMode ? 'Server Mode (data.xlsx loaded)' : 'Preview Mode (Embedded Data)'}
                  </p>
                  {isServerMode && <span className="text-xs bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">Full Data Access</span>}
                </div>
              </div>
            </div>

            {/* File Drop Zone */}
            <div 
              className={`relative group transition-all duration-300 border-dashed border-2 rounded-xl px-6 py-3 flex items-center gap-3 cursor-pointer
                ${dragActive ? 'border-amber-500 bg-amber-900/20 scale-105' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900/50'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                multiple 
                accept=".xlsx, .csv" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleManualUpload}
              />
              <div className="bg-neutral-800 p-2 rounded-full group-hover:bg-neutral-700 transition-colors">
                <Upload size={18} className="text-neutral-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <div className="text-sm">
                <p className="text-neutral-300 font-medium group-hover:text-amber-100 transition-colors">Drop .xlsx File</p>
                <p className="text-neutral-500 text-xs">{loadedFiles.length > 0 ? `Loaded external data` : "or replace data.xlsx on server"}</p>
              </div>
            </div>

          </div>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-4xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-neutral-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-12 py-4 bg-neutral-900/80 border border-neutral-700 rounded-2xl text-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 transition-all shadow-2xl"
              placeholder="Search for effects, items, stats (e.g., 'Attack Power Up')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute inset-y-0 right-4 flex items-center text-neutral-500 hover:text-neutral-300"
               >
                 <X size={20} />
               </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border
                  ${activeCategory === cat.id 
                    ? 'bg-amber-950/40 text-amber-200 border-amber-700/50 shadow-[0_0_10px_rgba(180,83,9,0.2)]' 
                    : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 hover:border-neutral-600'}
                `}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {loadError && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
                <AlertTriangle size={20} />
                {loadError}
            </div>
        )}

        {/* Results Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredData.map((item, idx) => (
              <DataCard key={idx} item={item} searchQuery={searchQuery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 opacity-60">
            <div className="relative inline-block group">
              <Filter className="h-16 w-16 mx-auto mb-4 text-neutral-700 transition-transform group-hover:scale-110" />
              <AlertTriangle className="h-6 w-6 text-amber-600 absolute bottom-4 right-0 bg-neutral-950 rounded-full animate-bounce" />
            </div>
            <p className="text-2xl font-serif text-neutral-400">No entries found</p>
            <p className="text-neutral-600 mt-2 max-w-md mx-auto">
              Your search for "<span className="text-neutral-400">{searchQuery}</span>" didn't match any records.
              <br/>Try verifying your spelling or dragging the .xlsx file directly.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

// --- Sub-component: Data Card ---
const DataCard = ({ item, searchQuery }) => {
  const category = item._category;
  
  // Clean up object keys for display
  const displayKeys = Object.keys(item).filter(k => 
    !k.startsWith('_') && 
    k !== 'Name' && 
    k !== 'Category' && 
    k !== 'In-Game' &&
    item[k] && 
    item[k] !== ''
  );

  let title = item.Name || item["Relic Description"] || item["Dormant Power"] || item["Effect Description In-Game"] || "Unknown Item";
  let sub = item.Category || item["In-Game"] || item["Effect Description In-Game"] || category;
  
  // Dynamic Icon Selection
  let Icon = Sparkles;
  let accentColor = "text-neutral-500 border-neutral-800";
  
  if (category === 'talismans') { Icon = Shield; accentColor = "text-blue-400 border-blue-900/30 bg-blue-900/10"; }
  if (category === 'weapons') { Icon = Sword; accentColor = "text-red-400 border-red-900/30 bg-red-900/10"; }
  if (category === 'stats') { Icon = Skull; accentColor = "text-purple-400 border-purple-900/30 bg-purple-900/10"; }
  if (category === 'consumables') { Icon = Droplet; accentColor = "text-emerald-400 border-emerald-900/30 bg-emerald-900/10"; }
  if (category === 'relics') { Icon = Scroll; accentColor = "text-amber-400 border-amber-900/30 bg-amber-900/10"; }
  if (category === 'dormantPowers') { Icon = Zap; accentColor = "text-yellow-400 border-yellow-900/30 bg-yellow-900/10"; }

  const isBoss = category === 'stats' && (item.Health || item.Poise);

  // Highlighter function
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    const str = String(text);
    const parts = str.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() 
        ? <span key={i} className="bg-amber-900/60 text-amber-200 font-bold px-0.5 rounded">{part}</span> 
        : part
    );
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-300 group
      ${isBoss ? 'bg-neutral-900/60 border-amber-900/40 hover:border-amber-700/60' : 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-600 hover:bg-neutral-900/60'}
    `}>
      {/* Accent Line */}
      <div className={`absolute top-0 left-0 w-1 h-full transition-all group-hover:w-1.5
        ${category === 'talismans' ? 'bg-blue-600' : ''}
        ${category === 'weapons' ? 'bg-red-600' : ''}
        ${category === 'stats' ? 'bg-purple-600' : ''}
        ${category === 'consumables' ? 'bg-emerald-600' : ''}
        ${category === 'relics' ? 'bg-amber-600' : ''}
        ${category === 'dormantPowers' ? 'bg-yellow-600' : ''}
        ${category === 'all' || !category ? 'bg-neutral-600' : ''}
      `} />

      <div className="p-5 pl-7">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-4">
            <h3 className={`text-lg font-serif font-bold leading-tight group-hover:text-neutral-100 transition-colors ${isBoss ? 'text-amber-100' : 'text-neutral-200'}`}>
              {highlightText(title, searchQuery)}
            </h3>
            {sub && (
              <span className="inline-block mt-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {sub}
              </span>
            )}
          </div>
          <div className={`p-2 rounded-lg border flex-shrink-0 ${accentColor}`}>
            <Icon size={18} />
          </div>
        </div>

        <div className="space-y-2.5">
          {displayKeys.slice(0, 6).map(key => (
            <div key={key} className="flex flex-col sm:flex-row sm:justify-between text-sm border-b border-neutral-800/50 pb-1 last:border-0 last:pb-0">
              <span className="text-neutral-500 text-xs font-medium uppercase tracking-wide sm:pt-0.5">{key}</span>
              <span className={`text-neutral-300 font-medium text-right ${key === 'Effect' ? 'text-amber-100/90' : ''}`}>
                {highlightText(item[key], searchQuery)}
              </span>
            </div>
          ))}
          {displayKeys.length > 6 && (
            <p className="text-xs text-neutral-600 italic pt-1 text-right">+{displayKeys.length - 6} more...</p>
          )}
        </div>
      </div>
    </div>
  );
};