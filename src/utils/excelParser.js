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

// Sheets to completely ignore during parsing
const IGNORED_SHEETS = [
  'Credits and Useful Links',
  'Chalices',
  'Character Stats Table (Outdated',
  'Guaranteed Relics'
];

/**
 * Parses a workbook into a structured data object
 * @param {XLSX.WorkBook} workbook - The workbook to parse
 * @returns {Object} - Data organized by sheet name
 */
export function parseWorkbook(workbook) {
  const data = {};

  workbook.SheetNames.forEach(sheetName => {
    // Skip ignored sheets
    if (IGNORED_SHEETS.includes(sheetName)) {
      return;
    }

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

