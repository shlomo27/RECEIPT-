import { useState } from 'react';

export default function AIAssistant({ onDismiss }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const suggestions = [
    'נסה לחפש "שניצל" - מתכון קלאסי ישראלי',
    'חפש "שקשוקה" - ארוחת בוקר מושלמת',
    'נסה "עוגת שוקולד" - קינוח שכולם אוהבים',
  ];

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl transition-all hover:scale-110 z-50"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-80 card shadow-2xl z-50 animate-fade-in">
      <div className="bg-gradient-to-l from-brand-500 to-brand-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="font-bold">שף AI עוזר</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-white/80 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-3">
          היי! אני שף AI. אני יכול לעזור לך למצוא מתכונים, לסכם מרכיבים ולהשוות מחירים. הנה כמה הצעות:
        </p>
        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-2.5 rounded-lg"
            >
              <span className="text-brand-400 mt-0.5">💡</span>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            יש לך שאלות נוספות? תמיד כאן לעזור!
          </p>
        </div>
      </div>
    </div>
  );
}
