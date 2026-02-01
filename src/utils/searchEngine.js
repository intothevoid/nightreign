/**
 * Categorizes a sheet name into a display category
 * @param {string} sheetName - The name of the sheet
 * @returns {string} - Category name for filtering/display
 */
export function categorizeSheet(sheetName) {
  const lower = sheetName.toLowerCase();

  // New categories
  if (lower === 'level up cost') return 'Levels';
  if (lower.includes('nightlord')) return 'Nightlord Stats';
  if (lower.includes('everdark') || lower.includes('sovereign')) return 'Everdark Sovereign Stats';

  // Existing categories
  if (lower.includes('talisman')) return 'Talismans';
  if (lower.includes('weapon')) return 'Weapons';
  if (lower.includes('dormant') || lower.includes('deep')) return 'Dormant Powers';
  if (lower.includes('relic')) return 'Relics';
  if (lower.includes('consumable')) return 'Consumables';
  if (lower.includes('character') && lower.includes('stat')) return 'Stats';

  return 'Other';
}

/**
 * Searches through all sheets and rows for matches
 * @param {Object} data - The parsed Excel data (sheetName -> array of rows)
 * @param {string} query - Search query string
 * @param {string} categoryFilter - Optional category to filter by (or 'all')
 * @returns {Array} - Array of matching rows with metadata
 */
export function searchAllSheets(data, query = '', categoryFilter = 'all') {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results = [];

  Object.entries(data).forEach(([sheetName, rows]) => {
    if (!Array.isArray(rows)) return;

    const category = categorizeSheet(sheetName);

    // Exclude 'Other' category completely
    if (category === 'Other') {
      return;
    }

    // Apply category filter
    if (categoryFilter !== 'all' && category !== categoryFilter) {
      return;
    }

    rows.forEach(row => {
      // If no query, include all items (with category filter applied)
      if (normalizedQuery === '') {
        results.push({
          ...row,
          _sheet: sheetName,
          _category: category
        });
        return;
      }

      // Check if any cell value contains the search term
      const matches = Object.entries(row).some(([key, value]) => {
        // Skip empty or null values
        if (value === null || value === undefined || value === '') return false;

        // Convert to string and search (case-insensitive)
        return String(value).toLowerCase().includes(normalizedQuery);
      });

      if (matches) {
        results.push({
          ...row,
          _sheet: sheetName,
          _category: category
        });
      }
    });
  });

  return results;
}

/**
 * Gets unique categories from the data
 * @param {Object} data - The parsed Excel data
 * @returns {Array} - Array of unique category names
 */
export function getCategories(data) {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const categories = new Set();

  Object.keys(data).forEach(sheetName => {
    const category = categorizeSheet(sheetName);
    // Exclude 'Other' category
    if (category !== 'Other') {
      categories.add(category);
    }
  });

  return Array.from(categories).sort();
}

/**
 * Highlights search terms in text
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @returns {string} - Text with highlighted portions
 */
export function highlightMatch(text, query) {
  if (!query || !text) return text;

  const normalizedQuery = query.trim();
  if (normalizedQuery === '') return text;

  // Create a regex for case-insensitive matching
  const regex = new RegExp(`(${escapeRegex(normalizedQuery)})`, 'gi');
  return String(text).replace(regex, '<mark>$1</mark>');
}

/**
 * Escapes special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
