import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('recipe_ai_user_id');
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem('recipe_ai_user_id', newId);
    return newId;
  });

  const [searchHistory, setSearchHistory] = useState([]);
  const [preferences, setPreferences] = useState({
    hasHistory: false,
    topSites: [],
    topChefs: [],
    recentSearches: [],
  });

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/preferences', {
        headers: { 'X-User-Id': userId },
      });
      const data = await res.json();
      setPreferences(data);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history', {
        headers: { 'X-User-Id': userId },
      });
      const data = await res.json();
      setSearchHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchPreferences();
    fetchHistory();
  }, [userId]);

  const value = {
    userId,
    searchHistory,
    preferences,
    fetchPreferences,
    fetchHistory,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
