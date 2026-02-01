import * as XLSX from 'xlsx';

/**
 * Loads and parses an Excel file from the given URL
 * @param {string} url - The URL of the Excel file
 * @returns {Promise<Object>} - Parsed data organized by sheet name
 */
export async function loadExcelFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    return parseWorkbook(workbook);
  } catch (error) {
    console.error('Error loading Excel file:', error);
    throw error;
  }
}

/**
 * Parses a workbook into a structured data object
 * @param {XLSX.WorkBook} workbook - The workbook to parse
 * @returns {Object} - Data organized by sheet name
 */
export function parseWorkbook(workbook) {
  const data = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false,  // Convert dates and numbers to strings
      defval: ''   // Default value for empty cells
    });

    // Only include sheets with data
    if (jsonData.length > 0) {
      data[sheetName] = jsonData;
    }
  });

  return data;
}

/**
 * Categorizes a sheet name into a display category
 * @param {string} sheetName - The name of the sheet
 * @returns {string} - Category name for filtering/display
 */
export function categorizeSheet(sheetName) {
  const lower = sheetName.toLowerCase();

  if (lower.includes('talisman')) return 'Talismans';
  if (lower.includes('weapon') && !lower.includes('deep')) return 'Weapons';
  if (lower.includes('dormant') || lower.includes('deep')) return 'Dormant Powers';
  if (lower.includes('relic') && !lower.includes('deep')) return 'Relics';
  if (lower.includes('consumable')) return 'Consumables';
  if (lower.includes('stat') || lower.includes('level')) return 'Stats';
  if (lower.includes('nightlord') || lower.includes('sovereign')) return 'Bosses';
  if (lower.includes('chalice')) return 'Chalices';
  if (lower.includes('guaranteed')) return 'Relics';

  return 'Other';
}
