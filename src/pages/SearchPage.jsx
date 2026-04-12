import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import PersonalizedMessage from '../components/PersonalizedMessage';
import AIAssistant from '../components/AIAssistant';
import * as api from '../utils/api';

export default function SearchPage() {
  const { searchHistory, preferences, fetchPreferences, fetchHistory } = useUser();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await api.searchRecipes(query);
      setResults(data);
      // Refresh preferences after search
      fetchPreferences();
      fetchHistory();
    } catch (err) {
      setError('אירעה שגיאה בחיפוש. נסה שוב.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

      {/* Results */}
      {results && (
        <div className="mt-10 max-w-4xl mx-auto">
          {/* Personalized message */}
          {results.personalizedMessages?.length > 0 && (
            <PersonalizedMessage
              messages={results.personalizedMessages}
              preferences={results.preferences}
            />
          )}

          {/* Results header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-800">
              נמצאו {results.totalResults} תוצאות עבור "{results.query}"
            </h3>
          </div>

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
              />
            ))}
          </div>

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

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
