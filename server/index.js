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
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  saveShoppingList,
  getShoppingLists,
  deleteShoppingList,
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

// --- Favorites ---
app.get('/api/favorites', (req, res) => {
  try {
    const favorites = getFavorites(req.userId);
    res.json(favorites);
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ error: 'שגיאה בטעינת מועדפים' });
  }
});

app.post('/api/favorites', (req, res) => {
  try {
    const { recipe } = req.body;
    if (!recipe || !recipe.url) {
      return res.status(400).json({ error: 'נא לספק מתכון' });
    }
    const added = addFavorite(req.userId, recipe);
    res.json({ success: true, added });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'שגיאה בשמירת מועדף' });
  }
});

app.delete('/api/favorites', (req, res) => {
  try {
    const { recipeUrl } = req.body;
    if (!recipeUrl) {
      return res.status(400).json({ error: 'נא לספק כתובת מתכון' });
    }
    removeFavorite(req.userId, recipeUrl);
    res.json({ success: true });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'שגיאה בהסרת מועדף' });
  }
});

app.get('/api/favorites/check', (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'נא לספק כתובת' });
    }
    const favorited = isFavorite(req.userId, url);
    res.json({ isFavorite: favorited });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה' });
  }
});

// --- Shopping Lists ---
app.get('/api/shopping-lists', (req, res) => {
  try {
    const lists = getShoppingLists(req.userId);
    res.json(lists);
  } catch (error) {
    console.error('Shopping lists error:', error);
    res.status(500).json({ error: 'שגיאה בטעינת רשימות קניות' });
  }
});

app.post('/api/shopping-lists', (req, res) => {
  try {
    const { name, items } = req.body;
    if (!name || !items || items.length === 0) {
      return res.status(400).json({ error: 'נא לספק שם ופריטים לרשימה' });
    }
    const id = saveShoppingList(req.userId, name, items);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Save shopping list error:', error);
    res.status(500).json({ error: 'שגיאה בשמירת רשימת קניות' });
  }
});

app.delete('/api/shopping-lists/:id', (req, res) => {
  try {
    const { id } = req.params;
    deleteShoppingList(req.userId, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete shopping list error:', error);
    res.status(500).json({ error: 'שגיאה במחיקת רשימת קניות' });
  }
});

// --- AI Chat ---
app.post('/api/chat', (req, res) => {
  try {
    const { message, recipeContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'נא להזין הודעה' });
    }
    const reply = generateChatReply(message, recipeContext);
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'שגיאה בצ\'אט' });
  }
});

function generateChatReply(message, recipeContext) {
  const lower = message.toLowerCase();

  if (recipeContext) {
    if (lower.includes('תחליף') || lower.includes('החלפ') || lower.includes('במקום')) {
      return `בהתבסס על המתכון "${recipeContext}", הנה כמה תחליפים נפוצים:\n• חמאה → שמן קוקוס או מרגרינה\n• ביצים → תחליף ביצה טבעוני (3 כפות אקווה-פאבה לכל ביצה)\n• שמנת → שמנת קוקוס או שמנת סויה\n• סוכר → דבש, סילאן, או ממתיק טבעי\n• קמח רגיל → קמח כוסמין או קמח שקדים (ללא גלוטן)`;
    }
    if (lower.includes('טיפ') || lower.includes('עצה') || lower.includes('סוד')) {
      return `טיפים למתכון "${recipeContext}":\n• תמיד חממו את התנור מראש לפחות 10 דקות\n• השתמשו במרכיבים בטמפרטורת החדר\n• אל תפתחו את התנור במהלך האפייה\n• טעמו ותתבלו בהדרגה - תמיד אפשר להוסיף, אי אפשר להוריד\n• תנו לבשר לנוח 5 דקות אחרי הבישול לפני חיתוך`;
    }
    if (lower.includes('כשר') || lower.includes('פרווה') || lower.includes('חלבי') || lower.includes('בשרי')) {
      return `לגבי כשרות למתכון "${recipeContext}":\n• ודאו שכל המוצרים נושאים הכשר מוכר\n• הפרידו בין כלי בשרי לחלבי\n• ניתן להפוך רוב המתכונים לפרווה באמצעות תחליפי חלב (שמנת סויה, חלב שקדים)\n• לגרסה בשרית - החליפו חמאה בשמן או מרגרינה`;
    }
  }

  if (lower.includes('בריאות') || lower.includes('בריא') || lower.includes('קלוריות') || lower.includes('דיאטה')) {
    return 'טיפים לבישול בריא:\n• העדיפו אפייה, צלייה או אידוי על פני טיגון\n• השתמשו בשמן זית במקום שמן רגיל\n• הוסיפו ירקות לכל מנה\n• הפחיתו מלח והשתמשו בתבלינים טריים\n• בחרו חלבון רזה (חזה עוף, דג, טופו)';
  }

  if (lower.includes('שלום') || lower.includes('היי') || lower.includes('מה שלומך')) {
    return 'שלום! אני שף AI, העוזר האישי שלך למתכונים. אני יכול לעזור לך עם:\n• חיפוש מתכונים\n• תחליפים למרכיבים\n• טיפים לבישול\n• התאמת מתכונים לדיאטות שונות\n• מידע על כשרות\n\nמה תרצה לדעת?';
  }

  if (lower.includes('טבעוני') || lower.includes('ויגן')) {
    return 'טיפים להכנת מתכונים טבעוניים:\n• החליפו חלב בחלב שקדים, סויה או קוקוס\n• במקום ביצים: טופו מרוסק, בננה, או זרעי פשתן טחונים\n• שמנת קוקוס מצוינת לרטבים ומאפים\n• שמרי בירה תזונתיים נותנות טעם "גבינתי"\n• טופו ותמפה הם תחליפי חלבון מצוינים';
  }

  if (lower.includes('ללא גלוטן') || lower.includes('צליאק') || lower.includes('גלוטן')) {
    return 'מתכונים ללא גלוטן:\n• השתמשו בקמח אורז, קמח תפוחי אדמה, או קמח שקדים\n• עמילן תירס מצוין לעיבוי רטבים\n• פסטה מאורז או תירס היא תחליף מעולה\n• ודאו שכל המוצרים מסומנים "ללא גלוטן"\n• שיבולת שועל ללא גלוטן זמינה ברוב הסופרים';
  }

  if (lower.includes('מה אפשר') || lower.includes('מה לבשל') || lower.includes('רעיון') || lower.includes('המלצה')) {
    return 'הנה כמה רעיונות למנות:\n• ארוחת בוקר: שקשוקה, חביתת ירקות, או גרנולה ביתית\n• ארוחת צהריים: סלט קיסר עם עוף, פיתה עם חומוס, או מרק עדשים\n• ארוחת ערב: פסטה ברוטב עגבניות, שניצל עם סלט, או דג צלוי\n• קינוח: עוגת שוקולד, פנקוטה, או פרות עם שוקולד\n\nחפש כל אחד מהם בשורת החיפוש!';
  }

  return 'תודה על השאלה! אני יכול לעזור עם:\n• חיפוש מתכונים - פשוט הקלד בשורת החיפוש\n• תחליפים למרכיבים - שאל "מה אפשר במקום X"\n• טיפים לבישול - שאל "טיפים ל..." \n• מתכונים טבעוניים / ללא גלוטן\n• מידע על כשרות\n• רעיונות למנות\n\nנסה לשאול אותי משהו ספציפי!';
}

app.listen(PORT, () => {
  console.log(`Recipe AI Server running on port ${PORT}`);
});
