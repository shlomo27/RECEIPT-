import { useState } from 'react';

export default function RecipeCard({ recipe, onSelect, onTrackClick, isPreferred, isFavorite, onToggleFavorite }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onTrackClick(recipe);
    onSelect(recipe);
  };

  const difficultyColors = {
    'קל מאוד': 'bg-green-100 text-green-700',
    'קל': 'bg-green-100 text-green-700',
    'בינוני': 'bg-yellow-100 text-yellow-700',
    'מתקדם': 'bg-red-100 text-red-700',
  };

  const platformStyles = {
    tiktok: { bg: 'bg-black', text: 'text-white', icon: '🎵', label: 'TikTok' },
    instagram: { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white', icon: '📸', label: 'Instagram' },
    youtube: { bg: 'bg-red-600', text: 'text-white', icon: '▶️', label: 'YouTube' },
  };

  const platform = recipe.platform ? platformStyles[recipe.platform] : null;

  return (
    <div
      className={`card cursor-pointer animate-fade-in ${isPreferred ? 'ring-2 ring-brand-400 ring-offset-2' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPreferred && !platform && (
        <div className="bg-gradient-to-l from-brand-500 to-brand-400 text-white text-xs font-medium px-3 py-1 flex items-center gap-1">
          <span>⭐</span>
          <span>מומלץ עבורך</span>
        </div>
      )}
      {platform && (
        <div className={`${platform.bg} ${platform.text} text-xs font-medium px-3 py-1 flex items-center justify-between`}>
          <div className="flex items-center gap-1">
            <span>{platform.icon}</span>
            <span>{platform.label}</span>
            {recipe.contentType === 'video' && <span className="mr-1">| סרטון</span>}
          </div>
          {recipe.views && (
            <span className="opacity-80">{recipe.views} צפיות</span>
          )}
        </div>
      )}

      {recipe.image && (
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-40 object-cover"
          />
          {recipe.contentType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-5 relative">
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe); }}
            className={`absolute top-3 left-3 p-1.5 rounded-full transition-all z-10 ${
              isFavorite
                ? 'text-red-500 hover:text-red-600 bg-red-50'
                : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
            }`}
            title={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
              {recipe.title}
            </h3>
            <p className={`text-sm font-medium ${platform ? 'text-gray-500' : 'text-brand-500'}`}>
              {recipe.siteName}
              {recipe.chefName?.startsWith('@') && (
                <span className="text-gray-400 mr-1"> | {recipe.chefName}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <span className="text-sm font-bold">{recipe.rating}</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {recipe.snippet}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.cookTime}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[recipe.difficulty] || 'bg-gray-100 text-gray-600'}`}>
              {recipe.difficulty}
            </span>
          </div>

          {recipe.chefName && (
            <span className="text-xs text-gray-400">
              {recipe.chefName}
            </span>
          )}
        </div>

        <div className={`mt-3 pt-3 border-t border-gray-50 flex items-center justify-between transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
          <span className="text-xs text-gray-400 truncate max-w-[200px]">
            {recipe.url}
          </span>
          <span className="text-brand-500 text-sm font-medium flex items-center gap-1">
            בחר מתכון
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
