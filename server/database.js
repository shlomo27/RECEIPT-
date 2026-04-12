import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data.json');

// Default DB structure
const defaultDB = {
  users: {},
  searchHistory: [],
  siteClicks: [],
  favorites: [],
  ingredientLists: [],
  shoppingLists: [],
};

function readDB() {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('DB read error, resetting:', e.message);
  }
  return { ...defaultDB };
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Initialize DB file if not exists
if (!fs.existsSync(dbPath)) {
  writeDB(defaultDB);
}

export function ensureUser(userId) {
  const db = readDB();
  if (!db.users[userId]) {
    db.users[userId] = { createdAt: new Date().toISOString() };
    writeDB(db);
  }
}

export function addSearchHistory(userId, query) {
  ensureUser(userId);
  const db = readDB();
  db.searchHistory.push({
    userId,
    query,
    searchedAt: new Date().toISOString(),
  });
  writeDB(db);
}

export function getSearchHistory(userId, limit = 20) {
  const db = readDB();
  return db.searchHistory
    .filter(h => h.userId === userId)
    .sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt))
    .slice(0, limit)
    .map(h => ({ query: h.query, searched_at: h.searchedAt }));
}

export function addSiteClick(userId, siteName, siteUrl, recipeTitle, chefName) {
  ensureUser(userId);
  const db = readDB();
  db.siteClicks.push({
    userId,
    siteName,
    siteUrl,
    recipeTitle: recipeTitle || null,
    chefName: chefName || null,
    clickedAt: new Date().toISOString(),
  });
  writeDB(db);
}

export function getTopSites(userId, limit = 5) {
  const db = readDB();
  const clicks = db.siteClicks.filter(c => c.userId === userId);
  const siteMap = {};
  clicks.forEach(c => {
    if (!siteMap[c.siteName]) {
      siteMap[c.siteName] = { site_name: c.siteName, site_url: c.siteUrl, visit_count: 0, last_visit: c.clickedAt };
    }
    siteMap[c.siteName].visit_count++;
    if (c.clickedAt > siteMap[c.siteName].last_visit) {
      siteMap[c.siteName].last_visit = c.clickedAt;
    }
  });
  return Object.values(siteMap)
    .sort((a, b) => b.visit_count - a.visit_count)
    .slice(0, limit);
}

export function getTopChefs(userId, limit = 5) {
  const db = readDB();
  const clicks = db.siteClicks.filter(c => c.userId === userId && c.chefName);
  const chefMap = {};
  clicks.forEach(c => {
    if (!chefMap[c.chefName]) {
      chefMap[c.chefName] = { chef_name: c.chefName, visit_count: 0, last_visit: c.clickedAt };
    }
    chefMap[c.chefName].visit_count++;
    if (c.clickedAt > chefMap[c.chefName].last_visit) {
      chefMap[c.chefName].last_visit = c.clickedAt;
    }
  });
  return Object.values(chefMap)
    .sort((a, b) => b.visit_count - a.visit_count)
    .slice(0, limit);
}

export function getUserPreferences(userId) {
  const topSites = getTopSites(userId);
  const topChefs = getTopChefs(userId);
  const recentSearches = getSearchHistory(userId, 10);
  return {
    topSites,
    topChefs,
    recentSearches,
    hasHistory: topSites.length > 0 || recentSearches.length > 0,
  };
}

export function saveIngredientList(userId, recipeUrl, recipeTitle, ingredients) {
  ensureUser(userId);
  const db = readDB();
  db.ingredientLists.push({
    userId,
    recipeUrl,
    recipeTitle,
    ingredients,
    createdAt: new Date().toISOString(),
  });
  writeDB(db);
}

// --- Favorites ---
export function addFavorite(userId, recipe) {
  ensureUser(userId);
  const db = readDB();
  const exists = db.favorites.find(
    f => f.userId === userId && f.recipeUrl === recipe.url
  );
  if (exists) return false;
  db.favorites.push({
    userId,
    recipeUrl: recipe.url,
    recipeTitle: recipe.title,
    siteName: recipe.siteName,
    chefName: recipe.chefName || null,
    rating: recipe.rating,
    cookTime: recipe.cookTime,
    difficulty: recipe.difficulty,
    snippet: recipe.snippet,
    siteUrl: recipe.siteUrl,
    savedAt: new Date().toISOString(),
  });
  writeDB(db);
  return true;
}

export function removeFavorite(userId, recipeUrl) {
  const db = readDB();
  db.favorites = db.favorites.filter(
    f => !(f.userId === userId && f.recipeUrl === recipeUrl)
  );
  writeDB(db);
}

export function getFavorites(userId) {
  const db = readDB();
  return db.favorites
    .filter(f => f.userId === userId)
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}

export function isFavorite(userId, recipeUrl) {
  const db = readDB();
  return db.favorites.some(f => f.userId === userId && f.recipeUrl === recipeUrl);
}

// --- Shopping Lists ---
export function saveShoppingList(userId, name, items) {
  ensureUser(userId);
  const db = readDB();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  db.shoppingLists.push({
    id,
    userId,
    name,
    items,
    createdAt: new Date().toISOString(),
    completed: false,
  });
  writeDB(db);
  return id;
}

export function getShoppingLists(userId) {
  const db = readDB();
  return db.shoppingLists
    .filter(l => l.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function deleteShoppingList(userId, listId) {
  const db = readDB();
  db.shoppingLists = db.shoppingLists.filter(
    l => !(l.userId === userId && l.id === listId)
  );
  writeDB(db);
}

export default { readDB, writeDB };
