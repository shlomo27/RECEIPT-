import { useState } from 'react';

export default function PriceComparison({ comparison, cheapest, savings, onClose }) {
  const [expandedStore, setExpandedStore] = useState(null);
  const [orderModal, setOrderModal] = useState(null);

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
                      setOrderModal(store);
                    }}
                    className="mt-3 w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    הזמן מ-{store.name}
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

      {/* Order Modal */}
      {orderModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setOrderModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{orderModal.logo}</span>
                הזמנה מ-{orderModal.name}
              </h3>
              <button
                onClick={() => setOrderModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-800">
              <p className="font-bold mb-1">💡 איך זה עובד?</p>
              <p>נפתח טאב נפרד לכל מוצר באתר {orderModal.name} עם חיפוש מוכן. התהליך:</p>
              <ol className="list-decimal mr-5 mt-1">
                <li>נלחץ על הכפתור הכחול</li>
                <li>כל מוצר יפתח בטאב נפרד עם חיפוש</li>
                <li>תלחץ "הוסף לעגלה" בכל טאב</li>
                <li>תעבור לעגלה, תתחבר ותשלם</li>
              </ol>
              <p className="mt-2 text-xs">💡 טיפ: ודא שהדפדפן מאפשר חלונות קופצים לאתר שלנו</p>
            </div>

            <h4 className="font-bold text-gray-700 mb-2">רשימת הקניות שלך:</h4>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-64 overflow-y-auto">
              {orderModal.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-gray-200 last:border-0">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-500">{item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 mt-2 border-t-2 border-gray-300">
                <span className="font-bold text-gray-800">סה"כ משוער:</span>
                <span className="font-bold text-green-600">₪{orderModal.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const proceed = confirm(
                    `זה יפתח ${orderModal.items.length} טאבים חדשים - אחד לכל מוצר (חיפוש בגוגל ב${orderModal.name}).\nהמשך?`
                  );
                  if (!proceed) return;
                  // Use Google search with store name - always works
                  orderModal.items.forEach((item, idx) => {
                    setTimeout(() => {
                      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.name + ' ' + orderModal.name)}`;
                      window.open(searchUrl, '_blank');
                    }, idx * 300);
                  });
                  setOrderModal(null);
                }}
                className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
              >
                🔍 חפש כל מוצר בגוגל ב-{orderModal.name} ({orderModal.items.length} טאבים)
              </button>
              <button
                onClick={() => {
                  // Open the store's main online shopping page
                  const storeHomes = {
                    'שופרסל': 'https://www.shufersal.co.il/online/he',
                    'רמי לוי': 'https://www.rami-levy.co.il/he',
                    'יינות ביתן': 'https://www.ybitan.co.il/',
                    'חצי חינם': 'https://www.hazi-hinam.co.il/',
                    'מגה': 'https://www.mega.co.il/',
                  };
                  const home = storeHomes[orderModal.name] || 'https://www.google.com/search?q=' + encodeURIComponent(orderModal.name);
                  window.open(home, '_blank');
                }}
                className="w-full btn-secondary py-3 rounded-xl flex items-center justify-center gap-2"
              >
                🏪 פתח את האתר הראשי של {orderModal.name}
              </button>
              <button
                onClick={() => {
                  const text = orderModal.items.map(i => `${i.name} - ${i.amount}`).join('\n');
                  navigator.clipboard.writeText(text).then(() => {
                    alert('הרשימה הועתקה ללוח!');
                  }).catch(() => alert('לא ניתן להעתיק'));
                }}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                📋 העתק רשימה בלבד
              </button>
              <button
                onClick={() => setOrderModal(null)}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
