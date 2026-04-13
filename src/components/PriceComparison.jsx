import { useState } from 'react';

export default function PriceComparison({ comparison, cheapest, savings, onClose }) {
  const [expandedStore, setExpandedStore] = useState(null);
  const [copiedStore, setCopiedStore] = useState(null);

  if (!comparison) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">השוואת מחירים</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Savings banner */}
      {savings > 0 && (
        <div className="bg-gradient-to-l from-green-500 to-emerald-500 text-white rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            💰
          </div>
          <div>
            <p className="font-bold text-lg">אפשר לחסוך עד ₪{savings.toFixed(2)}!</p>
            <p className="text-sm text-white/80">
              הכי זול ב-{cheapest.name} {cheapest.logo}
            </p>
          </div>
        </div>
      )}

      {/* Store comparison cards */}
      <div className="space-y-3">
        {comparison.map((store, index) => {
          const isCheapest = index === 0;
          const isExpanded = expandedStore === index;

          return (
            <div
              key={store.name}
              className={`card overflow-hidden ${isCheapest ? 'ring-2 ring-green-400 ring-offset-1' : ''}`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedStore(isExpanded ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{store.logo}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800">{store.name}</h4>
                        {isCheapest && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            הכי זול!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{store.items.length} פריטים</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`text-2xl font-bold ${isCheapest ? 'text-green-600' : 'text-gray-800'}`}>
                      ₪{store.totalPrice.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="text-xs">פרטים</span>
                      <svg
                        className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded items */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 animate-fade-in">
                  <div className="space-y-2">
                    {store.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <div>
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-xs text-gray-400 mr-2">({item.amount})</span>
                        </div>
                        <span className="text-sm font-bold text-gray-600">₪{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-700">סה"כ</span>
                    <span className="font-bold text-lg text-gray-800">₪{store.totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (store.orderUrl) {
                        // Copy shopping list to clipboard
                        const listText = store.items.map(i => `${i.name} - ${i.amount}`).join('\n');
                        navigator.clipboard.writeText(listText).catch(() => {});
                        setCopiedStore(store.name);
                        setTimeout(() => setCopiedStore(null), 3000);
                        // Open store with first ingredient as search
                        const firstItem = store.items[0]?.name || '';
                        window.open(store.orderUrl + encodeURIComponent(firstItem), '_blank');
                      }
                    }}
                    className="mt-3 w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {copiedStore === store.name ? 'הרשימה הועתקה! פותח חנות...' : `הזמן מ-${store.name}`}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-700 flex items-start gap-2">
          <span className="text-lg leading-none">ℹ️</span>
          <span>
            המחירים הם אומדן ועשויים להשתנות. מומלץ לבדוק את המחירים הסופיים באתר החנות לפני ההזמנה.
          </span>
        </p>
      </div>
    </div>
  );
}
