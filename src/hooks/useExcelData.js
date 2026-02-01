import { useState, useEffect } from 'react';
import { loadExcelFile } from '../utils/excelParser';

/**
 * Custom hook to load and manage Excel data
 * @param {string} fileUrl - URL of the Excel file to load
 * @returns {Object} - { data, loading, error, reload }
 */
export function useExcelData(fileUrl = '/nightreign-1.03.2.xlsx') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const parsedData = await loadExcelFile(fileUrl);
      setData(parsedData);
    } catch (err) {
      console.error('Failed to load Excel data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fileUrl]);

  return {
    data,
    loading,
    error,
    reload: loadData
  };
}
