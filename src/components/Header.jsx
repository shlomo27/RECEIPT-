import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md group-hover:shadow-lg transition-shadow">
            👨‍🍳
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">שף AI</h1>
            <p className="text-xs text-gray-400 leading-tight">מחפש המתכונים החכם</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            חיפוש
          </Link>
          <Link
            to="/history"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/history'
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            היסטוריה
          </Link>
        </nav>
      </div>
    </header>
  );
}
