import React, { useState, useMemo } from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
import { useExcelData } from './hooks/useExcelData';
import { searchAllSheets, getCategories } from './utils/searchEngine';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { DataCard } from './components/DataCard';
import { Footer } from './components/Footer';

export default function App() {
  const { data, loading, error, reload } = useExcelData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Get available categories from the data
  const categories = useMemo(() => {
    if (!data) return [];
    return getCategories(data);
  }, [data]);

  // Filter and search results
  const filteredResults = useMemo(() => {
    if (!data) return [];

    const categoryFilter = activeCategory === 'All' ? 'all' : activeCategory;
    return searchAllSheets(data, searchQuery, categoryFilter);
  }, [data, searchQuery, activeCategory]);

  // Handle manual file upload
  const handleDataLoaded = (newData) => {
    // This would require updating the useExcelData hook to accept manual data
    // For now, we'll just reload the default file
    console.log('New data loaded:', newData);
    reload();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-amber-900 selection:text-white flex flex-col">

      {/* Header */}
      <Header loading={loading} />

      {/* Search and Filters Container */}
      <div className="max-w-7xl mx-auto px-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {!loading && data && (
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
            <p className="text-xl text-neutral-400">Loading Nightreign data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
            <AlertTriangle size={20} />
            <div>
              <p className="font-semibold">Failed to load data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && data && (
          <>
            {filteredResults.length > 0 ? (
              <>
                <div className="mb-4 text-neutral-400 text-sm">
                  {searchQuery ? (
                    <>Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{searchQuery}"</>
                  ) : (
                    <>Showing {filteredResults.length} item{filteredResults.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}</>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((item, idx) => (
                    <DataCard key={idx} item={item} searchQuery={searchQuery} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24 opacity-60">
                <div className="relative inline-block group">
                  <Filter className="h-16 w-16 mx-auto mb-4 text-neutral-700 transition-transform group-hover:scale-110" />
                  <AlertTriangle className="h-6 w-6 text-amber-600 absolute bottom-4 right-0 bg-neutral-950 rounded-full animate-bounce" />
                </div>
                <p className="text-2xl font-serif text-neutral-400">No results found</p>
                <p className="text-neutral-600 mt-2 max-w-md mx-auto">
                  Your search for "<span className="text-neutral-400">{searchQuery}</span>" didn't match any records.
                  <br />
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </>
        )}

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
