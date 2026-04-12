import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading, recentSearches }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const popularSearches = [
    'שניצל', 'חומוס', 'שקשוקה', 'פסטה', 'עוגת שוקולד',
    'סלט קיסר', 'פיצה', 'מרק עוף', 'לזניה', 'בורקס'
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="מה בא לך לבשל היום? 🍳"
            className="w-full px-6 py-4 pr-6 pl-32 text-lg rounded-2xl border-2 border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all duration-200 shadow-sm hover:shadow-md text-right bg-white"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute left-2 top-1/2 -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                מחפש...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                חפש מתכון
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-40 overflow-hidden animate-fade-in">
          {recentSearches && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-50">
              <p className="text-xs font-medium text-gray-400 mb-2 px-1">חיפושים אחרונים</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 5).map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(item.query)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-brand-50 text-sm text-gray-600 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-3">
            <p className="text-xs font-medium text-gray-400 mb-2 px-1">חיפושים פופולריים</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-sm text-brand-600 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
