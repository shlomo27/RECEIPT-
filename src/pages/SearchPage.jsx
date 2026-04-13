import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import PersonalizedMessage from '../components/PersonalizedMessage';
import AIChat from '../components/AIChat';
import LoadingSkeleton from '../components/LoadingSkeleton';
import * as api from '../utils/api';

export default function SearchPage() {
  const { searchHistory, preferences, fetchPreferences, fetchHistory } = useUser();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [favoriteUrls, setFavoriteUrls] = useState(new Set());
  const [lastQuery, setLastQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.getFavorites().then(favs => {
      setFavoriteUrls(new Set(favs.map(f => f.recipeUrl)));
    }).catch(() => {});
  }, []);

  const handleSearch = useCallback(async (query, activeFilters) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastQuery(query);
    const filtersToUse = activeFilters || filters;
    try {
      const data = await api.searchRecipes(query, filtersToUse);
      setResults(data);
      fetchPreferences();
      fetchHistory();
    } catch (err) {
      setError('אירעה שגיאה בחיפוש. נסה שוב.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, fetchPreferences, fetchHistory]);

  const handleToggleFavorite = async (recipe) => {
    const isFav = favoriteUrls.has(recipe.url);
    try {
      if (isFav) {
        await api.removeFavorite(recipe.url);
        setFavoriteUrls(prev => { const s = new Set(prev); s.delete(recipe.url); return s; });
      } else {
        await api.addFavorite(recipe);
        setFavoriteUrls(prev => new Set(prev).add(recipe.url));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    if (lastQuery) handleSearch(lastQuery, newFilters);
  };

  const handleTrackClick = async (recipe) => {
    try {
      await api.trackClick(recipe.siteName, recipe.siteUrl, recipe.title, recipe.chefName);
      fetchPreferences();
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  };

  const handleSelectRecipe = (recipe) => {
    navigate('/recipe', { state: { recipe } });
  };

  return (
    <div className="pt-8">
      {/* Hero section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-soft" />
          מופעל בינה מלאכותית
        </div>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          מצא את המתכון המושלם
        </h2>
        <p className="text-lg text-gray-400 max-w-lg mx-auto">
          חפש כל מתכון ונקבל לך את הקישורים הכי טובים מכל הרשת, מותאם אישית בשבילך
        </p>
      </div>

      {/* Search bar */}
      <SearchBar
        onSearch={handleSearch}
        isLoading={isLoading}
        recentSearches={searchHistory}
      />

      {/* Error */}
      {error && (
        <div className="mt-6 max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 animate-fade-in">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="mt-10 max-w-4xl mx-auto">
          <LoadingSkeleton count={4} />
        </div>
      )}

      {/* Results */}
      {results && !isLoading && (
        <div className="mt-10 max-w-4xl mx-auto">
          {/* Personalized message */}
          {results.personalizedMessages?.length > 0 && (
            <PersonalizedMessage
              messages={results.personalizedMessages}
              preferences={results.preferences}
            />
          )}

          {/* Results header + filters */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-800">
              נמצאו {results.totalResults} תוצאות עבור "{results.query}"
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              סינון
            </button>
          </div>

          {/* Filters bar */}
          {showFilters && results.availableFilters && (
            <div className="mb-5 card p-4 flex flex-wrap gap-3 animate-fade-in">
              <select
                value={filters.cuisine || ''}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-400"
              >
                <option value="">כל המטבחים</option>
                {results.availableFilters.cuisines.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={filters.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-400"
              >
                <option value="">כל הרמות</option>
                {results.availableFilters.difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={filters.maxTime || ''}
                onChange={(e) => handleFilterChange('maxTime', e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-400"
              >
                <option value="">כל הזמנים</option>
                {results.availableFilters.maxTimes.map(t => (
                  <option key={t} value={t}>עד {t} דקות</option>
                ))}
              </select>
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={() => { setFilters({}); if (lastQuery) handleSearch(lastQuery, {}); }}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  נקה סינון
                </button>
              )}
            </div>
          )}

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.results.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipe={recipe}
                onSelect={handleSelectRecipe}
                onTrackClick={handleTrackClick}
                isPreferred={
                  results.preferences?.topSites?.some(
                    s => s.site_name.toLowerCase() === recipe.siteName.toLowerCase()
                  )
                }
                isFavorite={favoriteUrls.has(recipe.url)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {results.results.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              לא נמצאו תוצאות עם הסינון הנוכחי. נסה לשנות את הפילטרים.
            </div>
          )}

          {/* Follow-up */}
          <div className="mt-8 text-center">
            <div className="card inline-block p-6 max-w-md">
              <p className="text-gray-600 mb-3">
                מצאת את מה שחיפשת? או שיש לך בקשות נוספות?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="btn-secondary text-sm"
                >
                  חיפוש חדש
                </button>
                <button
                  onClick={() => setResults(null)}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  נקה תוצאות
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasSearched && !results && (
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { emoji: '🍝', name: 'פסטה' },
              { emoji: '🥘', name: 'שקשוקה' },
              { emoji: '🍗', name: 'שניצל' },
              { emoji: '🍰', name: 'עוגת שוקולד' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleSearch(item.name)}
                className="card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <span className="text-4xl block mb-2">{item.emoji}</span>
                <span className="text-sm font-medium text-gray-600">{item.name}</span>
              </button>
            ))}
          </div>

          {preferences.hasHistory && (
            <div className="mt-10 max-w-md mx-auto">
              <p className="text-sm text-gray-400 mb-3">האתרים המועדפים עליך</p>
              <div className="flex flex-wrap justify-center gap-2">
                {preferences.topSites?.map((site, i) => (
                  <span key={i} className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                    {site.site_name} ({site.visit_count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Chat */}
      <AIChat />
    </div>
  );
}
