import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import HistoryPage from './pages/HistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import ShoppingListsPage from './pages/ShoppingListsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/recipe" element={<RecipeDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/shopping-lists" element={<ShoppingListsPage />} />
        </Routes>
      </main>
    </div>
  );
}
