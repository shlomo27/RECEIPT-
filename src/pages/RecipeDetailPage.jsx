import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IngredientList from '../components/IngredientList';
import PriceComparison from '../components/PriceComparison';
import * as api from '../utils/api';

export default function RecipeDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  const [ingredients, setIngredients] = useState(null);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!recipe) {
      navigate('/');
    }
  }, [recipe, navigate]);

  if (!recipe) return null;

  const handleExtractIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
      const data = await api.getIngredients(recipe.title, recipe.url);
      setIngredients(data);
      setActiveTab('ingredients');
    } catch (err) {
      console.error('Failed to extract ingredients:', err);
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const handleComparePrices = async (selectedIngredients) => {
    setIsLoadingPrices(true);
    try {
      const data = await api.comparePrices(selectedIngredients);
      setPriceData(data);
      setActiveTab('prices');
    } catch (err) {
      console.error('Failed to compare prices:', err);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  return (
    <div className="pt-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        חזרה לתוצאות
      </button>

      {/* Recipe header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-brand-500 font-medium">{recipe.siteName}</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 text-amber-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm font-bold">{recipe.rating}</span>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">{recipe.title}</h2>
            <p className="text-gray-500 mb-4">{recipe.snippet}</p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.cookTime}
              </span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{recipe.difficulty}</span>
              {recipe.chefName && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {recipe.chefName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-3">
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            צפה במתכון המלא
          </a>
          <button
            onClick={handleExtractIngredients}
            disabled={isLoadingIngredients}
            className="btn-secondary flex items-center gap-2"
          >
            {isLoadingIngredients ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                מחלץ מרכיבים...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                סכם מרכיבים
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {(ingredients || priceData) && (
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'info'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            מידע
          </button>
          {ingredients && (
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ingredients'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              מרכיבים ({ingredients.ingredients.length})
            </button>
          )}
          {priceData && (
            <button
              onClick={() => setActiveTab('prices')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'prices'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              השוואת מחירים
            </button>
          )}
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'ingredients' && ingredients && (
        <IngredientList
          ingredients={ingredients.ingredients}
          recipeTitle={ingredients.recipeTitle}
          onComparePrices={handleComparePrices}
        />
      )}

      {activeTab === 'prices' && priceData && (
        <PriceComparison
          comparison={priceData.comparison}
          cheapest={priceData.cheapest}
          savings={priceData.savings}
          onClose={() => {
            setPriceData(null);
            setActiveTab('ingredients');
          }}
        />
      )}

      {isLoadingPrices && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">משווה מחירים בין חנויות...</p>
        </div>
      )}

      {/* AI follow-up */}
      <div className="mt-8 card p-6 bg-gradient-to-l from-brand-50 to-white border-brand-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-gray-800 mb-1">שף AI שואל</p>
            <p className="text-sm text-gray-600 mb-3">
              {ingredients
                ? 'מצוין! סימנת את המרכיבים? תוכל להשוות מחירים ולהזמין ישירות. יש לך בקשות נוספות?'
                : 'בחרת מתכון מעולה! רוצה שאסכם לך את רשימת המרכיבים?'
              }
            </p>
            <div className="flex flex-wrap gap-2">
              {!ingredients && (
                <button
                  onClick={handleExtractIngredients}
                  className="text-sm bg-brand-100 text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-200 transition-colors"
                >
                  כן, סכם מרכיבים
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                חפש מתכון אחר
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
