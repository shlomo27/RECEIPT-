import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export default function HistoryPage() {
  const { searchHistory, preferences } = useUser();

  return (
    <div className="pt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">ההיסטוריה שלי</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search History */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            חיפושים אחרונים
          </h3>
          {searchHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">עדיין אין חיפושים. התחל לחפש מתכונים!</p>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">{item.query}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.searched_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Sites */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            אתרים מועדפים
          </h3>
          {!preferences.topSites || preferences.topSites.length === 0 ? (
            <p className="text-gray-400 text-sm">עוד לא נאספו העדפות. המשך להשתמש ואלמד מה אתה אוהב!</p>
          ) : (
            <div className="space-y-2">
              {preferences.topSites.map((site, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      #{i + 1}
                    </div>
                    <span className="font-medium text-gray-700">{site.site_name}</span>
                  </div>
                  <span className="bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full text-sm font-medium">
                    {site.visit_count} ביקורים
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Chefs */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">👨‍🍳</span>
            שפים מועדפים
          </h3>
          {!preferences.topChefs || preferences.topChefs.length === 0 ? (
            <p className="text-gray-400 text-sm">עוד לא זיהינו שפים מועדפים. המשך לגלות מתכונים!</p>
          ) : (
            <div className="space-y-2">
              {preferences.topChefs.map((chef, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-sm">
                      👨‍🍳
                    </div>
                    <span className="font-medium text-gray-700">{chef.chef_name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{chef.visit_count} מתכונים</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="card p-6 bg-gradient-to-br from-brand-50 to-white border-brand-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            תובנות AI
          </h3>
          <div className="space-y-3">
            {preferences.hasHistory ? (
              <>
                {preferences.topSites?.length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-brand-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-brand-600">אתר מועדף: </span>
                      נראה שאתה מעדיף מתכונים מ-{preferences.topSites[0].site_name}.
                      אני מתעדף תוצאות משם בחיפושים הבאים שלך!
                    </p>
                  </div>
                )}
                {preferences.topChefs?.length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-brand-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-brand-600">שף מועדף: </span>
                      שמתי לב שאתה אוהב מתכונים של {preferences.topChefs[0].chef_name}.
                      אשים לב להציג מתכונים שלהם ראשונים!
                    </p>
                  </div>
                )}
                <div className="bg-white p-3 rounded-xl border border-brand-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-brand-600">סטטיסטיקה: </span>
                    ביצעת {searchHistory.length} חיפושים עד כה.
                    ככל שתשתמש יותר, אלמד את ההעדפות שלך טוב יותר!
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                התחל לחפש מתכונים ואני אלמד את ההעדפות שלך!
                ככל שתשתמש יותר, המלצות יהיו מדויקות יותר.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
