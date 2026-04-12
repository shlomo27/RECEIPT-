import { useState, useMemo } from 'react';

export default function IngredientList({ ingredients, recipeTitle, onComparePrices }) {
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const categories = useMemo(() => {
    const cats = {};
    ingredients.forEach(ing => {
      if (!cats[ing.category]) cats[ing.category] = [];
      cats[ing.category].push(ing);
    });
    return cats;
  }, [ingredients]);

  const toggleItem = (index) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
    setSelectAll(newSelected.size === ingredients.length);
  };

  const toggleAll = () => {
    if (selectAll) {
      setSelected(new Set());
    } else {
      setSelected(new Set(ingredients.map((_, i) => i)));
    }
    setSelectAll(!selectAll);
  };

  const selectedIngredients = ingredients.filter((_, i) => selected.has(i));

  const categoryIcons = {
    'ירקות': '🥬',
    'פירות': '🍎',
    'בשר ועוף': '🍗',
    'חלב וביצים': '🥛',
    'מוצרי יסוד': '🏪',
    'שמנים ותבלינים': '🧂',
    'קטניות ודגנים': '🌾',
    'שימורים': '🥫',
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          רשימת מרכיבים - {recipeTitle}
        </h3>
        <button
          onClick={toggleAll}
          className="text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          {selectAll ? 'נקה הכל' : 'בחר הכל'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="card p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span>{categoryIcons[category] || '📦'}</span>
              {category}
            </h4>
            <div className="space-y-2">
              {items.map((ing) => {
                const globalIndex = ingredients.indexOf(ing);
                const isSelected = selected.has(globalIndex);
                return (
                  <label
                    key={globalIndex}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-50 border border-brand-200'
                        : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(globalIndex)}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-brand-500 focus:ring-brand-200 cursor-pointer"
                    />
                    <span className="flex-1 font-medium text-gray-700">{ing.name}</span>
                    <span className="text-sm text-gray-400">{ing.amount}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="mt-6 sticky bottom-4">
          <button
            onClick={() => onComparePrices(selectedIngredients)}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 rounded-2xl shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            השווה מחירים ל-{selected.size} מרכיבים
          </button>
        </div>
      )}
    </div>
  );
}
