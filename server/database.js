import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'recipe_ai.db');

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    query TEXT NOT NULL,
    searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS site_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    site_name TEXT NOT NULL,
    site_url TEXT NOT NULL,
    recipe_title TEXT,
    chef_name TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS favorite_recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    recipe_url TEXT NOT NULL,
    recipe_title TEXT,
    site_name TEXT,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ingredient_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    recipe_url TEXT NOT NULL,
    recipe_title TEXT,
    ingredients TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export function ensureUser(userId) {
  const stmt = db.prepare('INSERT OR IGNORE INTO users (id) VALUES (?)');
  stmt.run(userId);
}

export function addSearchHistory(userId, query) {
  ensureUser(userId);
  const stmt = db.prepare('INSERT INTO search_history (user_id, query) VALUES (?, ?)');
  stmt.run(userId, query);
}

export function getSearchHistory(userId, limit = 20) {
  const stmt = db.prepare(
    'SELECT query, searched_at FROM search_history WHERE user_id = ? ORDER BY searched_at DESC LIMIT ?'
  );
  return stmt.all(userId, limit);
}

export function addSiteClick(userId, siteName, siteUrl, recipeTitle, chefName) {
  ensureUser(userId);
  const stmt = db.prepare(
    'INSERT INTO site_clicks (user_id, site_name, site_url, recipe_title, chef_name) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(userId, siteName, siteUrl, recipeTitle || null, chefName || null);
}

export function getTopSites(userId, limit = 5) {
  const stmt = db.prepare(`
    SELECT site_name, site_url, COUNT(*) as visit_count,
           MAX(clicked_at) as last_visit
    FROM site_clicks
    WHERE user_id = ?
    GROUP BY site_name
    ORDER BY visit_count DESC
    LIMIT ?
  `);
  return stmt.all(userId, limit);
}

export function getTopChefs(userId, limit = 5) {
  const stmt = db.prepare(`
    SELECT chef_name, COUNT(*) as visit_count,
           MAX(clicked_at) as last_visit
    FROM site_clicks
    WHERE user_id = ? AND chef_name IS NOT NULL AND chef_name != ''
    GROUP BY chef_name
    ORDER BY visit_count DESC
    LIMIT ?
  `);
  return stmt.all(userId, limit);
}

export function getUserPreferences(userId) {
  const topSites = getTopSites(userId);
  const topChefs = getTopChefs(userId);
  const recentSearches = getSearchHistory(userId, 10);

  return {
    topSites,
    topChefs,
    recentSearches,
    hasHistory: topSites.length > 0 || recentSearches.length > 0
  };
}

export function saveIngredientList(userId, recipeUrl, recipeTitle, ingredients) {
  ensureUser(userId);
  const stmt = db.prepare(
    'INSERT INTO ingredient_lists (user_id, recipe_url, recipe_title, ingredients) VALUES (?, ?, ?, ?)'
  );
  stmt.run(userId, recipeUrl, recipeTitle, JSON.stringify(ingredients));
}

export default db;
