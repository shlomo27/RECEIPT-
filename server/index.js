import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  addSearchHistory,
  getSearchHistory,
  addSiteClick,
  getUserPreferences,
  saveIngredientList,
  getTopSites,
  getTopChefs,
} from './database.js';
import { searchRecipes, extractIngredients, comparePrices } from './recipeSearch.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware to ensure user ID
app.use((req, res, next) => {
  req.userId = req.headers['x-user-id'] || 'anonymous';
  next();
});

// Search recipes
app.post('/api/search', (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'נא להזין שם מתכון לחיפוש' });
    }

    // Save search history
    addSearchHistory(req.userId, query.trim());

    // Get user preferences
    const preferences = getUserPreferences(req.userId);

    // Search and personalize
    const results = searchRecipes(query.trim(), preferences);

    res.json({
      ...results,
      preferences: {
        hasHistory: preferences.hasHistory,
        topSites: preferences.topSites.slice(0, 3),
        topChefs: preferences.topChefs.slice(0, 3),
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'שגיאה בחיפוש, נסה שוב' });
  }
});

// Track site click
app.post('/api/track-click', (req, res) => {
  try {
    const { siteName, siteUrl, recipeTitle, chefName } = req.body;
    addSiteClick(req.userId, siteName, siteUrl, recipeTitle, chefName);
    res.json({ success: true });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'שגיאה בשמירה' });
  }
});

// Get user preferences
app.get('/api/preferences', (req, res) => {
  try {
    const preferences = getUserPreferences(req.userId);
    res.json(preferences);
  } catch (error) {
    console.error('Preferences error:', error);
    res.status(500).json({ error: 'שגיאה בטעינת העדפות' });
  }
});

// Get search history
app.get('/api/history', (req, res) => {
  try {
    const history = getSearchHistory(req.userId);
    res.json(history);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'שגיאה בטעינת היסטוריה' });
  }
});

// Extract ingredients from recipe
app.post('/api/ingredients', (req, res) => {
  try {
    const { recipeTitle, recipeUrl } = req.body;
    const ingredients = extractIngredients(recipeTitle);

    // Save to DB
    saveIngredientList(req.userId, recipeUrl, recipeTitle, ingredients);

    res.json({
      recipeTitle,
      ingredients,
      categories: [...new Set(ingredients.map(i => i.category))],
    });
  } catch (error) {
    console.error('Ingredients error:', error);
    res.status(500).json({ error: 'שגיאה בחילוץ מרכיבים' });
  }
});

// Compare prices
app.post('/api/compare-prices', (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'נא לבחור מרכיבים להשוואת מחירים' });
    }

    const comparison = comparePrices(ingredients);

    res.json({
      comparison,
      cheapest: comparison[0],
      savings: Math.round((comparison[comparison.length - 1].totalPrice - comparison[0].totalPrice) * 100) / 100,
    });
  } catch (error) {
    console.error('Price comparison error:', error);
    res.status(500).json({ error: 'שגיאה בהשוואת מחירים' });
  }
});

// Get top sites for user
app.get('/api/top-sites', (req, res) => {
  try {
    const sites = getTopSites(req.userId);
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה' });
  }
});

// Get top chefs for user
app.get('/api/top-chefs', (req, res) => {
  try {
    const chefs = getTopChefs(req.userId);
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה' });
  }
});

app.listen(PORT, () => {
  console.log(`🍳 Recipe AI Server running on port ${PORT}`);
});
