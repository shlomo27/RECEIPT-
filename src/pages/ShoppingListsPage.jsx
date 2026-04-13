import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../utils/api';

export default function ShoppingListsPage() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const data = await api.getShoppingLists();
      setLists(data);
    } catch (err) {
      console.error('Failed to load shopping lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteShoppingList(id);
      setLists(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete shopping list:', err);
    }
  };

  const handleExport = (list) => {
    const text = `רשימת קניות: ${list.name}\n${new Date(list.createdAt).toLocaleDateString('he-IL')}\n${'─'.repeat(30)}\n${list.items.map(item => `- ${item.name} (${item.amount})`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('הרשימה הועתקה!');
    }).catch(() => {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${list.name}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (isLoading) {
    return (
      <div className="pt-8 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">טוען רשימות קניות...</p>
      </div>
    );
  }

  return (
    <div className="pt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-7 h-7 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        רשימות קניות
      </h2>

      {lists.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">🛒</span>
          <h3 className="text-lg font-bold text-gray-600 mb-2">אין רשימות קניות</h3>
          <p className="text-gray-400 mb-4">חפש מתכון, חלץ מרכיבים ושמור אותם כרשימת קניות</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            חפש מתכונים
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div key={list.id} className="card animate-fade-in">
              <div
                className="p-5 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === list.id ? null : list.id)}
              >
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{list.name}</h3>
                  <p className="text-sm text-gray-400">
                    {list.items.length} פריטים | {new Date(list.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === list.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expandedId === list.id && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                  <ul className="space-y-2 mb-4">
                    {list.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-400">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport(list)}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      העתק/ייצא
                    </button>
                    <button
                      onClick={() => handleDelete(list.id)}
                      className="text-sm text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      מחק
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
