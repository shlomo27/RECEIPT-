import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../utils/api';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (recipeUrl) => {
    try {
      await api.removeFavorite(recipeUrl);
      setFavorites(prev => prev.filter(f => f.recipeUrl !== recipeUrl));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handleSelect = (fav) => {
    navigate('/recipe', {
      state: {
        recipe: {
          title: fav.recipeTitle,
          url: fav.recipeUrl,
          siteName: fav.siteName,
          siteUrl: fav.siteUrl,
          chefName: fav.chefName,
          rating: fav.rating,
          cookTime: fav.cookTime,
          difficulty: fav.difficulty,
          snippet: fav.snippet,
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="pt-8 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">טוען מועדפים...</p>
      </div>
    );
  }

  return (
    <div className="pt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        המועדפים שלי
      </h2>

      {favorites.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">💔</span>
          <h3 className="text-lg font-bold text-gray-600 mb-2">אין מועדפים עדיין</h3>
          <p className="text-gray-400 mb-4">חפש מתכונים ולחץ על הלב כדי לשמור אותם כאן</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            חפש מתכונים
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => (
            <div key={fav.recipeUrl} className="card p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 cursor-pointer" onClick={() => handleSelect(fav)}>
                  <h3 className="font-bold text-gray-800 leading-tight mb-1 line-clamp-2 hover:text-brand-500 transition-colors">
                    {fav.recipeTitle}
                  </h3>
                  <p className="text-sm text-brand-500 font-medium">{fav.siteName}</p>
                </div>
                <button
                  onClick={() => handleRemove(fav.recipeUrl)}
                  className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                  title="הסר מהמועדפים"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{fav.snippet}</p>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fav.cookTime}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{fav.difficulty}</span>
                {fav.rating && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {fav.rating}
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-300">
                נשמר: {new Date(fav.savedAt).toLocaleDateString('he-IL')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
