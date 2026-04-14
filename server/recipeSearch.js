// Known recipe sites with metadata
const RECIPE_SITES = {
  'foodnetwork.com': { name: 'Food Network', hebrewName: 'פוד נטוורק' },
  'allrecipes.com': { name: 'AllRecipes', hebrewName: 'אול רסיפיז' },
  'bbcgoodfood.com': { name: 'BBC Good Food', hebrewName: 'BBC Good Food' },
  'simplyrecipes.com': { name: 'Simply Recipes', hebrewName: 'סימפלי רסיפיז' },
  'delish.com': { name: 'Delish', hebrewName: 'דליש' },
  'epicurious.com': { name: 'Epicurious', hebrewName: 'אפיקוריוס' },
  'bonappetit.com': { name: 'Bon Appétit', hebrewName: 'בון אפטיט' },
  'tasteofdome.com': { name: 'Taste of Home', hebrewName: 'טייסט אוף הום' },
  'seriouseats.com': { name: 'Serious Eats', hebrewName: 'סיריוס איטס' },
  'cookieandkate.com': { name: 'Cookie and Kate', hebrewName: 'קוקי אנד קייט' },
  'hashulchan.co.il': { name: 'השולחן', hebrewName: 'השולחן' },
  'foodish.co.il': { name: 'פודיש', hebrewName: 'פודיש' },
  'myvegan.co.il': { name: 'מאי ויגן', hebrewName: 'מאי ויגן' },
  '10dakot.co.il': { name: '10 דקות', hebrewName: '10 דקות' },
  'al-hashulchan.co.il': { name: 'על השולחן', hebrewName: 'על השולחן' },
  'tiktok.com': { name: 'TikTok', hebrewName: 'טיקטוק' },
  'instagram.com': { name: 'Instagram', hebrewName: 'אינסטגרם' },
  'youtube.com': { name: 'YouTube', hebrewName: 'יוטיוב' },
  'facebook.com': { name: 'Facebook', hebrewName: 'פייסבוק' },
  'pinterest.com': { name: 'Pinterest', hebrewName: 'פינטרסט' },
};

function getSiteName(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const [domain, info] of Object.entries(RECIPE_SITES)) {
      if (hostname.includes(domain)) {
        return info;
      }
    }
    return { name: hostname, hebrewName: hostname };
  } catch {
    return { name: 'אתר לא ידוע', hebrewName: 'אתר לא ידוע' };
  }
}

function extractChefName(title, snippet) {
  const chefPatterns = [
    /(?:by|מאת|של)\s+(?:chef\s+)?([A-Za-zא-ת\s]+?)(?:\s*[-|,]|$)/i,
    /(?:שף|שפית)\s+([A-Za-zא-ת\s]+?)(?:\s*[-|,]|$)/i,
  ];
  const text = `${title} ${snippet}`;
  for (const pattern of chefPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

// Recipe metadata database with cuisine, difficulty, maxTime
const RECIPE_META = {
  'שניצל': { cuisine: 'ישראלי', difficulty: 'קל', maxTime: 30 },
  'חומוס': { cuisine: 'מזרחי', difficulty: 'בינוני', maxTime: 120 },
  'שקשוקה': { cuisine: 'ישראלי', difficulty: 'קל', maxTime: 25 },
  'פסטה': { cuisine: 'אירופאי', difficulty: 'קל', maxTime: 30 },
  'עוגת שוקולד': { cuisine: 'אירופאי', difficulty: 'בינוני', maxTime: 60 },
  'פלאפל': { cuisine: 'ישראלי', difficulty: 'בינוני', maxTime: 45 },
  'מרק עוף': { cuisine: 'ישראלי', difficulty: 'קל', maxTime: 90 },
  'לזניה': { cuisine: 'אירופאי', difficulty: 'מתקדם', maxTime: 90 },
  'סלט קיסר': { cuisine: 'אירופאי', difficulty: 'קל', maxTime: 15 },
  'בורקס': { cuisine: 'ישראלי', difficulty: 'בינוני', maxTime: 60 },
  'קוסקוס': { cuisine: 'מזרחי', difficulty: 'בינוני', maxTime: 75 },
  'חציל': { cuisine: 'מזרחי', difficulty: 'קל', maxTime: 30 },
  'כנאפה': { cuisine: 'מזרחי', difficulty: 'מתקדם', maxTime: 60 },
  'מוסקה': { cuisine: 'אירופאי', difficulty: 'מתקדם', maxTime: 90 },
  'מלווח': { cuisine: 'מזרחי', difficulty: 'בינוני', maxTime: 180 },
  'ג\'חנון': { cuisine: 'מזרחי', difficulty: 'בינוני', maxTime: 480 },
  'סביח': { cuisine: 'ישראלי', difficulty: 'קל', maxTime: 20 },
  'פיצה': { cuisine: 'אירופאי', difficulty: 'בינוני', maxTime: 60 },
  'טאקו': { cuisine: 'אחר', difficulty: 'קל', maxTime: 30 },
  'סושי': { cuisine: 'אסייתי', difficulty: 'מתקדם', maxTime: 60 },
  'קארי': { cuisine: 'אסייתי', difficulty: 'בינוני', maxTime: 45 },
  'שווארמה': { cuisine: 'מזרחי', difficulty: 'בינוני', maxTime: 40 },
  'קובה': { cuisine: 'מזרחי', difficulty: 'מתקדם', maxTime: 90 },
  'מג\'דרה': { cuisine: 'מזרחי', difficulty: 'קל', maxTime: 45 },
  'פריטטה': { cuisine: 'אירופאי', difficulty: 'קל', maxTime: 25 },
  'המבורגר': { cuisine: 'אחר', difficulty: 'קל', maxTime: 25 },
};

// Simulated search results (in production, use a real search API like Google Custom Search or Bing)
// This provides realistic demo data
function generateSearchResults(query) {
  // Map Hebrew recipe names to English for image search
  const imageKeywords = {
    'שניצל': 'schnitzel', 'חומוס': 'hummus', 'שקשוקה': 'shakshuka',
    'פסטה': 'pasta', 'עוגת שוקולד': 'chocolate+cake', 'פלאפל': 'falafel',
    'מרק עוף': 'chicken+soup', 'לזניה': 'lasagna', 'סלט קיסר': 'caesar+salad',
    'בורקס': 'bourekas', 'קוסקוס': 'couscous', 'חציל': 'eggplant',
    'כנאפה': 'kunafa', 'מוסקה': 'moussaka', 'מלווח': 'malawach',
    "ג'חנון": 'jachnun', 'סביח': 'sabich+pita', 'פיצה': 'pizza',
    'טאקו': 'taco', 'סושי': 'sushi', 'קארי': 'curry',
    'שווארמה': 'shawarma', 'קובה': 'kibbeh', "מג'דרה": 'mujaddara',
    'פריטטה': 'frittata', 'המבורגר': 'hamburger',
  };
  // Food emojis for visual placeholders
  const recipeEmojis = {
    'שניצל': '🍗', 'חומוס': '🥙', 'שקשוקה': '🍳', 'פסטה': '🍝',
    'עוגת שוקולד': '🍰', 'פלאפל': '🧆', 'מרק עוף': '🍲',
    'לזניה': '🍝', 'סלט קיסר': '🥗', 'בורקס': '🥐', 'קוסקוס': '🍛',
    'חציל': '🍆', 'כנאפה': '🍮', 'מוסקה': '🥘', 'מלווח': '🫓',
    "ג'חנון": '🥨', 'סביח': '🌯', 'פיצה': '🍕', 'טאקו': '🌮',
    'סושי': '🍣', 'קארי': '🍛', 'שווארמה': '🌯', 'קובה': '🥟',
    "מג'דרה": '🍚', 'פריטטה': '🥘', 'המבורגר': '🍔',
  };
  const emoji = recipeEmojis[query] || '🍽️';

  // Use Google image search as fallback - but we'll use emoji-based
  // data URL so images always work offline
  const emojiToImage = (e) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#fed7aa"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="180" font-size="120" text-anchor="middle">${e}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };
  const getImage = () => emojiToImage(emoji);

  // Make URLs search Google for the real recipe (not fake pages)
  // Using simple Google search - returns the most popular results
  const googleSearch = (q) => `https://www.google.com/search?q=${encodeURIComponent('מתכון ' + q)}`;
  const googleSiteSearch = (site, q) => `https://www.google.com/search?q=${encodeURIComponent('מתכון ' + q + ' ' + site)}`;

  const recipeSites = [
    {
      title: `${query} - מתכון מושלם | מאקו`,
      url: googleSiteSearch('מאקו', query),
      snippet: `מתכון ל${query} מאתר מאקו - מתכונים מפורטים עם תמונות ודירוגים.`,
      siteName: 'Mako מאקו',
      siteUrl: 'https://www.mako.co.il',
      chefName: 'שפים של מאקו',
      rating: 4.7,
      cookTime: '45 דקות',
      difficulty: 'בינוני',
      image: getImage(),
    },
    {
      title: `מתכון ${query} | Ynet מטבח`,
      url: googleSiteSearch('ynet', query),
      snippet: `${query} - אחד המתכונים הפופולריים ב-Ynet מטבח. עם אלפי דירוגים חיוביים.`,
      siteName: 'Ynet מטבח',
      siteUrl: 'https://www.ynet.co.il',
      chefName: 'מטבח Ynet',
      rating: 4.6,
      cookTime: '50 דקות',
      difficulty: 'קל',
      image: getImage(),
    },
    {
      title: `${query} - Food Network`,
      url: googleSiteSearch('food network', query),
      snippet: `The ultimate ${query} recipe from Food Network's expert chefs.`,
      siteName: 'Food Network',
      siteUrl: 'https://www.foodnetwork.com',
      chefName: 'Food Network',
      rating: 4.9,
      cookTime: '30 דקות',
      difficulty: 'מתקדם',
      image: getImage(),
    },
    {
      title: `${query} Recipe | AllRecipes`,
      url: googleSiteSearch('allrecipes', query),
      snippet: `A community favorite ${query} recipe with thousands of reviews.`,
      siteName: 'AllRecipes',
      siteUrl: 'https://www.allrecipes.com',
      chefName: null,
      rating: 4.5,
      cookTime: '50 דקות',
      difficulty: 'קל',
      image: getImage(),
    },
    {
      title: `מתכון ${query} | Walla! אוכל`,
      url: googleSiteSearch('וואלה', query),
      snippet: `${query} - מתכון מדליק מהמטבח של וואלה. הוראות פשוטות וברורות.`,
      siteName: 'Walla! אוכל',
      siteUrl: 'https://www.walla.co.il',
      chefName: 'Walla אוכל',
      rating: 4.4,
      cookTime: '40 דקות',
      difficulty: 'קל',
      image: getImage(),
    },
    {
      title: `${query} - Bon Appétit`,
      url: googleSiteSearch('bon appetit', query),
      snippet: `Bon Appétit's test kitchen perfected ${query} recipe.`,
      siteName: 'Bon Appétit',
      siteUrl: 'https://www.bonappetit.com',
      chefName: 'Bon Appétit',
      rating: 4.7,
      cookTime: '40 דקות',
      difficulty: 'בינוני',
      image: getImage(),
    },
    {
      title: `מתכון ${query} | מתכוני שף`,
      url: googleSiteSearch('שף', query),
      snippet: `${query} מאת שפים מובילים בישראל. טיפים מקצועיים ומתכון מדויק.`,
      siteName: 'שף ישראל',
      siteUrl: 'https://www.google.com',
      chefName: 'שפים ישראלים',
      rating: 4.6,
      cookTime: '55 דקות',
      difficulty: 'בינוני',
      image: getImage(),
    },
    {
      title: `חיפוש ${query} בגוגל - כל התוצאות`,
      url: googleSearch(query),
      snippet: `ראה את כל המתכונים הפופולריים ל${query} - יותר מ-100 תוצאות מהאתרים הכי טובים.`,
      siteName: 'חיפוש כללי',
      siteUrl: 'https://www.google.com',
      chefName: null,
      rating: 5.0,
      cookTime: 'מגוון',
      difficulty: 'מגוון',
      image: getImage(),
    },
  ];

  return recipeSites;
}

// Generate personalized recommendations based on user preferences
function getPersonalizedMessage(preferences, results) {
  const messages = [];

  if (preferences.topSites.length > 0) {
    const topSite = preferences.topSites[0];
    messages.push(
      `שמתי לב שאתה מעדיף מתכונים מ-**${topSite.site_name}** (ביקרת שם ${topSite.visit_count} פעמים). העברתי אותם למעלה! 🎯`
    );
  }

  if (preferences.topChefs.length > 0) {
    const topChef = preferences.topChefs[0];
    messages.push(
      `מההיסטוריה שלך, אני מזהה שאתה אוהב מתכונים של **${topChef.chef_name}** - שמתי אותם בעדיפות גבוהה!`
    );
  }

  return messages;
}

// Sort results based on user preferences
function sortByPreference(results, preferences) {
  if (!preferences.hasHistory) return results;

  const siteScores = {};
  preferences.topSites.forEach((site, index) => {
    siteScores[site.site_name.toLowerCase()] = (5 - index) * 10;
  });

  const chefScores = {};
  preferences.topChefs.forEach((chef, index) => {
    chefScores[chef.chef_name.toLowerCase()] = (5 - index) * 8;
  });

  return results.sort((a, b) => {
    const scoreA = (siteScores[a.siteName.toLowerCase()] || 0) +
                   (a.chefName && chefScores[a.chefName.toLowerCase()] ? chefScores[a.chefName.toLowerCase()] : 0);
    const scoreB = (siteScores[b.siteName.toLowerCase()] || 0) +
                   (b.chefName && chefScores[b.chefName.toLowerCase()] ? chefScores[b.chefName.toLowerCase()] : 0);
    return scoreB - scoreA;
  });
}

export function searchRecipes(query, preferences, filters = {}) {
  let results = generateSearchResults(query);

  // Apply cuisine metadata from RECIPE_META
  const meta = RECIPE_META[query] || RECIPE_META[query.trim()] || null;
  if (meta) {
    results = results.map(r => ({
      ...r,
      cuisine: meta.cuisine,
      maxTime: meta.maxTime,
    }));
  }

  // Apply filters
  if (filters.cuisine) {
    results = results.filter(r => !r.cuisine || r.cuisine === filters.cuisine);
  }
  if (filters.difficulty) {
    results = results.filter(r => r.difficulty === filters.difficulty);
  }
  if (filters.maxTime) {
    const maxMin = parseInt(filters.maxTime, 10);
    results = results.filter(r => {
      const mins = parseInt(r.cookTime, 10);
      return isNaN(mins) || mins <= maxMin;
    });
  }

  // Sort by user preferences
  results = sortByPreference(results, preferences);

  // Generate personalized message
  const personalizedMessages = getPersonalizedMessage(preferences, results);

  return {
    results,
    personalizedMessages,
    totalResults: results.length,
    query,
    availableFilters: {
      cuisines: ['ישראלי', 'מזרחי', 'אירופאי', 'אסייתי', 'אחר'],
      difficulties: ['קל', 'בינוני', 'מתקדם'],
      maxTimes: [15, 30, 45, 60, 90, 120],
    },
  };
}

// Generate demo ingredient list for a recipe
export function extractIngredients(recipeTitle) {
  const ingredientDB = {
    default: [
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'פלפל שחור', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'בצל', amount: '2 יחידות', category: 'ירקות' },
      { name: 'שום', amount: '4 שיניים', category: 'ירקות' },
    ],
    'שניצל': [
      { name: 'חזה עוף', amount: '4 יחידות', category: 'בשר ועוף' },
      { name: 'ביצים', amount: '3 יחידות', category: 'חלב וביצים' },
      { name: 'פירורי לחם', amount: '2 כוסות', category: 'מוצרי יסוד' },
      { name: 'קמח', amount: 'כוס', category: 'מוצרי יסוד' },
      { name: 'שמן לטיגון', amount: 'לפי הצורך', category: 'שמנים ותבלינים' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'פלפל שחור', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'פפריקה', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'חומוס': [
      { name: 'גרגירי חומוס', amount: '500 גרם', category: 'קטניות ודגנים' },
      { name: 'טחינה גולמית', amount: 'חצי כוס', category: 'מוצרי יסוד' },
      { name: 'לימון', amount: '2 יחידות', category: 'פירות' },
      { name: 'שום', amount: '3 שיניים', category: 'ירקות' },
      { name: 'שמן זית', amount: '4 כפות', category: 'שמנים ותבלינים' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'סודה לשתייה', amount: 'כפית', category: 'מוצרי יסוד' },
    ],
    'שקשוקה': [
      { name: 'עגבניות', amount: '6 יחידות', category: 'ירקות' },
      { name: 'ביצים', amount: '6 יחידות', category: 'חלב וביצים' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'פלפל חריף', amount: '1 יחידה', category: 'ירקות' },
      { name: 'שום', amount: '4 שיניים', category: 'ירקות' },
      { name: 'רסק עגבניות', amount: 'כף', category: 'שימורים' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'פפריקה מתוקה', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'מלח ופלפל', amount: 'לפי הטעם', category: 'שמנים ותבלינים' },
    ],
    'פסטה': [
      { name: 'פסטה', amount: '500 גרם', category: 'קטניות ודגנים' },
      { name: 'שמנת מתוקה', amount: 'כוס', category: 'חלב וביצים' },
      { name: 'פרמזן', amount: 'חצי כוס מגורר', category: 'חלב וביצים' },
      { name: 'שום', amount: '3 שיניים', category: 'ירקות' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'פטריות', amount: '200 גרם', category: 'ירקות' },
      { name: 'שמן זית', amount: '2 כפות', category: 'שמנים ותבלינים' },
      { name: 'מלח ופלפל', amount: 'לפי הטעם', category: 'שמנים ותבלינים' },
      { name: 'בזיליקום טרי', amount: 'חופן', category: 'ירקות' },
    ],
    'עוגת שוקולד': [
      { name: 'שוקולד מריר', amount: '200 גרם', category: 'מוצרי יסוד' },
      { name: 'חמאה', amount: '150 גרם', category: 'חלב וביצים' },
      { name: 'סוכר', amount: 'כוס', category: 'מוצרי יסוד' },
      { name: 'ביצים', amount: '4 יחידות', category: 'חלב וביצים' },
      { name: 'קמח', amount: 'כוס', category: 'מוצרי יסוד' },
      { name: 'אבקת אפייה', amount: 'כפית', category: 'מוצרי יסוד' },
      { name: 'קקאו', amount: '3 כפות', category: 'מוצרי יסוד' },
      { name: 'שמנת מתוקה', amount: 'חצי כוס', category: 'חלב וביצים' },
      { name: 'תמצית וניל', amount: 'כפית', category: 'מוצרי יסוד' },
    ],
    'פלאפל': [
      { name: 'גרגירי חומוס', amount: '500 גרם', category: 'קטניות ודגנים' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'פטרוזיליה', amount: 'חופן גדול', category: 'ירקות' },
      { name: 'כוסברה', amount: 'חופן', category: 'ירקות' },
      { name: 'שום', amount: '5 שיניים', category: 'ירקות' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'כורכום', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'אבקת אפייה', amount: 'כפית', category: 'מוצרי יסוד' },
      { name: 'שמן לטיגון עמוק', amount: 'לפי הצורך', category: 'שמנים ותבלינים' },
    ],
    'מרק עוף': [
      { name: 'עוף שלם', amount: '1 ק"ג', category: 'בשר ועוף' },
      { name: 'גזר', amount: '3 יחידות', category: 'ירקות' },
      { name: 'סלרי', amount: '3 גבעולים', category: 'ירקות' },
      { name: 'בצל', amount: '2 יחידות', category: 'ירקות' },
      { name: 'שורש פטרוזיליה', amount: '1 יחידה', category: 'ירקות' },
      { name: 'כורכום', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'מלח', amount: '2 כפיות', category: 'שמנים ותבלינים' },
      { name: 'פלפל שחור', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'אטריות', amount: '200 גרם', category: 'קטניות ודגנים' },
    ],
    'לזניה': [
      { name: 'דפי לזניה', amount: '250 גרם', category: 'קטניות ודגנים' },
      { name: 'בשר טחון', amount: '500 גרם', category: 'בשר ועוף' },
      { name: 'רסק עגבניות', amount: 'פחית', category: 'שימורים' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'שום', amount: '4 שיניים', category: 'ירקות' },
      { name: 'מוצרלה', amount: '300 גרם', category: 'חלב וביצים' },
      { name: 'רוטב בשמל', amount: '2 כוסות', category: 'חלב וביצים' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'אורגנו', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'סלט קיסר': [
      { name: 'חסה רומית', amount: '2 ראשים', category: 'ירקות' },
      { name: 'פרמזן', amount: '50 גרם', category: 'חלב וביצים' },
      { name: 'קרוטונים', amount: 'כוס', category: 'מוצרי יסוד' },
      { name: 'אנשובי', amount: '4 פילה', category: 'דגים' },
      { name: 'שום', amount: '2 שיניים', category: 'ירקות' },
      { name: 'חרדל דיז\'ון', amount: 'כפית', category: 'רטבים' },
      { name: 'מיץ לימון', amount: '2 כפות', category: 'פירות' },
      { name: 'שמן זית', amount: 'רבע כוס', category: 'שמנים ותבלינים' },
    ],
    'בורקס': [
      { name: 'בצק עלים', amount: '500 גרם', category: 'מוצרי יסוד' },
      { name: 'גבינה בולגרית', amount: '300 גרם', category: 'חלב וביצים' },
      { name: 'תפוחי אדמה', amount: '3 יחידות', category: 'ירקות' },
      { name: 'ביצים', amount: '2 יחידות', category: 'חלב וביצים' },
      { name: 'שמיר', amount: 'חופן', category: 'ירקות' },
      { name: 'שומשום', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'מלח ופלפל', amount: 'לפי הטעם', category: 'שמנים ותבלינים' },
    ],
    'קוסקוס': [
      { name: 'קוסקוס', amount: '2 כוסות', category: 'קטניות ודגנים' },
      { name: 'חזה עוף', amount: '500 גרם', category: 'בשר ועוף' },
      { name: 'גזר', amount: '3 יחידות', category: 'ירקות' },
      { name: 'קישוא', amount: '2 יחידות', category: 'ירקות' },
      { name: 'חומוס מבושל', amount: 'כוס', category: 'קטניות ודגנים' },
      { name: 'צימוקים', amount: 'חצי כוס', category: 'פירות' },
      { name: 'חריסה', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
    ],
    'חציל': [
      { name: 'חציל', amount: '3 יחידות', category: 'ירקות' },
      { name: 'טחינה גולמית', amount: 'חצי כוס', category: 'מוצרי יסוד' },
      { name: 'שום', amount: '3 שיניים', category: 'ירקות' },
      { name: 'לימון', amount: '1 יחידה', category: 'פירות' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'פטרוזיליה', amount: 'חופן', category: 'ירקות' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'כנאפה': [
      { name: 'קדאיף', amount: '500 גרם', category: 'מוצרי יסוד' },
      { name: 'גבינת עכאווי', amount: '400 גרם', category: 'חלב וביצים' },
      { name: 'חמאה', amount: '200 גרם', category: 'חלב וביצים' },
      { name: 'סוכר', amount: 'כוס', category: 'מוצרי יסוד' },
      { name: 'מי ורדים', amount: '2 כפות', category: 'מוצרי יסוד' },
      { name: 'לימון', amount: 'חצי', category: 'פירות' },
      { name: 'פיסטוקים', amount: 'רבע כוס', category: 'אגוזים' },
    ],
    'מוסקה': [
      { name: 'חציל', amount: '3 יחידות', category: 'ירקות' },
      { name: 'בשר טחון', amount: '500 גרם', category: 'בשר ועוף' },
      { name: 'בצל', amount: '2 יחידות', category: 'ירקות' },
      { name: 'רסק עגבניות', amount: 'פחית', category: 'שימורים' },
      { name: 'שמנת מתוקה', amount: 'כוס', category: 'חלב וביצים' },
      { name: 'ביצים', amount: '2 יחידות', category: 'חלב וביצים' },
      { name: 'אגוז מוסקט', amount: 'קמצוץ', category: 'שמנים ותבלינים' },
      { name: 'שמן זית', amount: '4 כפות', category: 'שמנים ותבלינים' },
    ],
    'מלווח': [
      { name: 'קמח', amount: '4 כוסות', category: 'מוצרי יסוד' },
      { name: 'מים', amount: 'כוס וחצי', category: 'מוצרי יסוד' },
      { name: 'סוכר', amount: 'כף', category: 'מוצרי יסוד' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'שמרים יבשים', amount: 'כפית', category: 'מוצרי יסוד' },
      { name: 'מרגרינה', amount: '200 גרם', category: 'חלב וביצים' },
      { name: 'ביצה', amount: '1 יחידה', category: 'חלב וביצים' },
    ],
    'ג\'חנון': [
      { name: 'קמח', amount: '4 כוסות', category: 'מוצרי יסוד' },
      { name: 'מים', amount: 'כוס וחצי', category: 'מוצרי יסוד' },
      { name: 'סוכר', amount: '2 כפות', category: 'מוצרי יסוד' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'חמאה', amount: '150 גרם', category: 'חלב וביצים' },
      { name: 'דבש', amount: 'כף', category: 'מוצרי יסוד' },
      { name: 'ביצים לגריסה', amount: '6 יחידות', category: 'חלב וביצים' },
    ],
    'סביח': [
      { name: 'חציל', amount: '2 יחידות', category: 'ירקות' },
      { name: 'ביצים קשות', amount: '2 יחידות', category: 'חלב וביצים' },
      { name: 'טחינה גולמית', amount: 'חצי כוס', category: 'מוצרי יסוד' },
      { name: 'עגבנייה', amount: '1 יחידה', category: 'ירקות' },
      { name: 'מלפפון', amount: '1 יחידה', category: 'ירקות' },
      { name: 'פיתה', amount: '2 יחידות', category: 'מוצרי יסוד' },
      { name: 'אמבה', amount: '2 כפות', category: 'רטבים' },
      { name: 'חריף', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'פיצה': [
      { name: 'קמח', amount: '3 כוסות', category: 'מוצרי יסוד' },
      { name: 'שמרים יבשים', amount: 'כפית', category: 'מוצרי יסוד' },
      { name: 'רוטב עגבניות', amount: 'כוס', category: 'שימורים' },
      { name: 'מוצרלה', amount: '300 גרם', category: 'חלב וביצים' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'בזיליקום', amount: 'חופן', category: 'ירקות' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'סוכר', amount: 'כפית', category: 'מוצרי יסוד' },
    ],
    'טאקו': [
      { name: 'טורטייה', amount: '8 יחידות', category: 'מוצרי יסוד' },
      { name: 'בשר טחון', amount: '400 גרם', category: 'בשר ועוף' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'עגבנייה', amount: '2 יחידות', category: 'ירקות' },
      { name: 'אבוקדו', amount: '1 יחידה', category: 'ירקות' },
      { name: 'לימון', amount: '1 יחידה', category: 'פירות' },
      { name: 'כוסברה', amount: 'חופן', category: 'ירקות' },
      { name: 'פפריקה מעושנת', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'סושי': [
      { name: 'אורז סושי', amount: '2 כוסות', category: 'קטניות ודגנים' },
      { name: 'דפי נורי', amount: '10 יחידות', category: 'מוצרי יסוד' },
      { name: 'סלמון טרי', amount: '300 גרם', category: 'דגים' },
      { name: 'אבוקדו', amount: '1 יחידה', category: 'ירקות' },
      { name: 'מלפפון', amount: '1 יחידה', category: 'ירקות' },
      { name: 'חומץ אורז', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'רוטב סויה', amount: '50 מ"ל', category: 'רטבים' },
      { name: 'וואסבי', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'קארי': [
      { name: 'חזה עוף', amount: '500 גרם', category: 'בשר ועוף' },
      { name: 'חלב קוקוס', amount: 'פחית', category: 'שימורים' },
      { name: 'משחת קארי', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'שום', amount: '4 שיניים', category: 'ירקות' },
      { name: 'ג\'ינג\'ר', amount: 'כף טרי', category: 'ירקות' },
      { name: 'פלפל אדום', amount: '1 יחידה', category: 'ירקות' },
      { name: 'אורז', amount: '2 כוסות', category: 'קטניות ודגנים' },
      { name: 'כוסברה', amount: 'חופן', category: 'ירקות' },
    ],
    'שווארמה': [
      { name: 'חזה הודו', amount: '700 גרם', category: 'בשר ועוף' },
      { name: 'בצל', amount: '2 יחידות', category: 'ירקות' },
      { name: 'טחינה', amount: 'חצי כוס', category: 'מוצרי יסוד' },
      { name: 'פיתה', amount: '4 יחידות', category: 'מוצרי יסוד' },
      { name: 'כורכום', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'פפריקה', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'חומץ', amount: 'כף', category: 'שמנים ותבלינים' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
    ],
    'קובה': [
      { name: 'בורגול דק', amount: '2 כוסות', category: 'קטניות ודגנים' },
      { name: 'בשר טחון', amount: '400 גרם', category: 'בשר ועוף' },
      { name: 'בצל', amount: '2 יחידות', category: 'ירקות' },
      { name: 'צנוברים', amount: 'רבע כוס', category: 'אגוזים' },
      { name: 'בהרט', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'כמון', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'מלח ופלפל', amount: 'לפי הטעם', category: 'שמנים ותבלינים' },
      { name: 'שמן לטיגון', amount: 'לפי הצורך', category: 'שמנים ותבלינים' },
    ],
    'מג\'דרה': [
      { name: 'אורז', amount: '2 כוסות', category: 'קטניות ודגנים' },
      { name: 'עדשים ירוקות', amount: 'כוס', category: 'קטניות ודגנים' },
      { name: 'בצל', amount: '4 יחידות', category: 'ירקות' },
      { name: 'שמן זית', amount: 'חצי כוס', category: 'שמנים ותבלינים' },
      { name: 'כמון', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
    ],
    'פריטטה': [
      { name: 'ביצים', amount: '8 יחידות', category: 'חלב וביצים' },
      { name: 'תפוחי אדמה', amount: '2 יחידות', category: 'ירקות' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'פלפל אדום', amount: '1 יחידה', category: 'ירקות' },
      { name: 'גבינה צהובה', amount: 'כוס מגוררת', category: 'חלב וביצים' },
      { name: 'שמן זית', amount: '3 כפות', category: 'שמנים ותבלינים' },
      { name: 'מלח ופלפל', amount: 'לפי הטעם', category: 'שמנים ותבלינים' },
      { name: 'פטרוזיליה', amount: 'חופן', category: 'ירקות' },
    ],
    'המבורגר': [
      { name: 'בשר טחון (70/30)', amount: '500 גרם', category: 'בשר ועוף' },
      { name: 'לחמניות המבורגר', amount: '4 יחידות', category: 'מוצרי יסוד' },
      { name: 'בצל', amount: '1 יחידה', category: 'ירקות' },
      { name: 'חסה', amount: '4 עלים', category: 'ירקות' },
      { name: 'עגבנייה', amount: '1 יחידה', category: 'ירקות' },
      { name: 'מלפפון חמוץ', amount: '4 פרוסות', category: 'ירקות' },
      { name: 'גבינה צהובה / צ\'דר', amount: '4 פרוסות', category: 'חלב וביצים' },
      { name: 'קטשופ', amount: '3 כפות', category: 'רטבים' },
      { name: 'חרדל', amount: '2 כפות', category: 'רטבים' },
      { name: 'מלח', amount: 'כפית', category: 'שמנים ותבלינים' },
      { name: 'פלפל שחור', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'פפריקה מעושנת', amount: 'חצי כפית', category: 'שמנים ותבלינים' },
      { name: 'שמן לצלייה', amount: 'כף', category: 'שמנים ותבלינים' },
    ],
  };

  // Find matching ingredients
  const lowerTitle = recipeTitle.toLowerCase();
  for (const [key, ingredients] of Object.entries(ingredientDB)) {
    if (key !== 'default' && lowerTitle.includes(key)) {
      return ingredients;
    }
  }

  // Return default + some contextual
  return ingredientDB.default;
}

// Generate recipe preparation steps
export function extractSteps(recipeTitle) {
  const stepsDB = {
    'שניצל': [
      'חותכים את חזה העוף לפרוסות דקות ומכים עם פטיש בשר.',
      'מכינים 3 צלחות: קמח, ביצים טרופות, פירורי לחם עם תבלינים.',
      'מטבלים כל פרוסה בקמח, אחר כך בביצה, ולבסוף בפירורי לחם.',
      'מחממים שמן עמוק במחבת על אש בינונית-גבוהה.',
      'מטגנים כ-3 דקות מכל צד עד לצבע זהוב.',
      'מניחים על נייר סופג ומגישים מיד.',
    ],
    'שקשוקה': [
      'מחממים שמן זית במחבת רחבה על אש בינונית.',
      'מטגנים בצל קצוץ עד שהוא שקוף, מוסיפים שום ופלפל חריף.',
      'מוסיפים עגבניות קצוצות, רסק עגבניות, כמון ופפריקה.',
      'מבשלים כ-15 דקות עד שהרוטב מתעבה.',
      'יוצרים גומחות ברוטב ושוברים ביצה לכל גומחה.',
      'מכסים ומבשלים 5-8 דקות עד שהביצים מוכנות לפי הטעם.',
      'מתבלים במלח ופלפל ומגישים עם לחם טרי.',
    ],
    'חומוס': [
      'שורים את החומוס במים למשך לילה עם סודה לשתייה.',
      'מבשלים את החומוס במים רותחים כשעה-שעתיים עד שהוא רך מאוד.',
      'מסננים ושומרים קצת מים מהבישול.',
      'מעבירים לבלנדר עם טחינה, מיץ לימון, שום וכמון.',
      'טוחנים עד לקבלת מרקם חלק, מוסיפים מי בישול לפי הצורך.',
      'מתבלים במלח ומגישים עם שמן זית, חומוס שלם ופפריקה.',
    ],
    'פסטה': [
      'מבשלים פסטה במים רותחים ומלוחים לפי ההוראות על האריזה.',
      'במקביל, מחממים שמן זית במחבת ומטגנים בצל ושום.',
      'מוסיפים פטריות ומטגנים עד שמזהיבות.',
      'מוסיפים שמנת ומביאים לרתיחה קלה.',
      'מסננים את הפסטה ומוסיפים למחבת עם הרוטב.',
      'מערבבים עם פרמזן מגורר, מתבלים ומגישים עם בזיליקום טרי.',
    ],
    'עוגת שוקולד': [
      'מחממים תנור ל-170 מעלות ומשמנים תבנית.',
      'ממיסים שוקולד מריר עם חמאה במיקרוגל או בן מרי.',
      'טורפים ביצים עם סוכר עד לקבלת תערובת אוורירית.',
      'מוסיפים את תערובת השוקולד לביצים ומערבבים.',
      'מקפלים קמח, קקאו ואבקת אפייה בעדינות.',
      'יוצקים לתבנית ואופים 25-30 דקות.',
      'מוציאים מהתנור ומשאירים להתקרר לפני הגשה.',
    ],
    'פלאפל': [
      'שורים את החומוס במים למשך לילה (לא מבשלים!).',
      'מסננים וטוחנים עם בצל, פטרוזיליה, כוסברה ושום.',
      'מתבלים בכמון, כורכום, מלח ופלפל.',
      'מוסיפים אבקת אפייה ומערבבים.',
      'מצננים במקרר לפחות שעה.',
      'יוצרים כדורים ומטגנים בשמן עמוק ב-180 מעלות עד שמזהיבים.',
      'מגישים בפיתה עם טחינה, סלט וחמוצים.',
    ],
    'המבורגר': [
      'מוציאים את הבשר מהמקרר 20 דקות לפני ההכנה.',
      'מחלקים ל-4 חלקים שווים ויוצרים קציצות עגולות (לא ללחוץ חזק!).',
      'עושים גומחה קטנה במרכז כל קציצה (מונע נפיחה).',
      'מתבלים במלח, פלפל ופפריקה מעושנת משני הצדדים.',
      'מחממים מחבת/גריל על אש גבוהה עם מעט שמן.',
      'צולים 3-4 דקות מכל צד (מדיום) - לא ללחוץ על הבשר!',
      'בדקה האחרונה מניחים פרוסת גבינה על כל קציצה ומכסים.',
      'קולים את הלחמניות על המחבת 30 שניות.',
      'מרכיבים: לחמנייה תחתונה, חסה, קציצה עם גבינה, עגבנייה, מלפפון חמוץ, קטשופ וחרדל.',
    ],
    'סושי': [
      'שוטפים אורז סושי 3-4 פעמים עד שהמים צלולים.',
      'מבשלים את האורז לפי ההוראות ומוסיפים חומץ אורז חם.',
      'מניחים דף נורי על מחצלת גלגול (צד מבריק כלפי מטה).',
      'פורסים שכבת אורז דקה על הנורי, משאירים 2 ס"מ בקצה.',
      'מניחים פרוסות סלמון, אבוקדו ומלפפון במרכז.',
      'מגלגלים בעזרת המחצלת ולוחצים בעדינות.',
      'חותכים לחתיכות בסכין חדה ורטובה.',
      'מגישים עם רוטב סויה ווואסבי.',
    ],
    'לזניה': [
      'מחממים תנור ל-180 מעלות.',
      'מטגנים בשר טחון עם בצל ושום עד שמשחים.',
      'מוסיפים רסק עגבניות, אורגנו, מלח ופלפל ומבשלים 15 דקות.',
      'מכינים רוטב בשמל: חמאה, קמח, חלב ואגוז מוסקט.',
      'שכבה ראשונה בתבנית: רוטב עגבניות, דפי לזניה, בשמל, מוצרלה.',
      'חוזרים על השכבות 3 פעמים, מסיימים בבשמל ומוצרלה.',
      'מכסים בנייר כסף ואופים 30 דקות, מגלים ואופים עוד 15 דקות.',
    ],
    'קארי': [
      'חותכים את חזה העוף לקוביות.',
      'מחממים שמן ומטגנים בצל, שום וג\'ינג\'ר.',
      'מוסיפים משחת קארי ומטגנים דקה.',
      'מוסיפים את העוף ומטגנים עד שמלבין.',
      'יוצקים חלב קוקוס ומביאים לרתיחה.',
      'מוסיפים פלפל אדום ומבשלים 15-20 דקות.',
      'מגישים על אורז עם כוסברה טרייה.',
    ],
    'שווארמה': [
      'חותכים את ההודו לרצועות דקות.',
      'מערבבים כורכום, כמון, פפריקה, חומץ ושמן זית לתערובת תיבול.',
      'מכניסים את ההודו לתיבול ומצננים לפחות שעה.',
      'מחממים מחבת גדולה על אש גבוהה.',
      'מטגנים את ההודו עם בצל פרוס עד שמשחים ומקורמלים.',
      'מגישים בפיתה עם טחינה, סלט, חומוס וחמוצים.',
    ],
  };

  const lowerTitle = recipeTitle.toLowerCase();
  for (const [key, steps] of Object.entries(stepsDB)) {
    if (lowerTitle.includes(key)) {
      return steps;
    }
  }

  // Generic steps for unknown recipes
  return [
    'מכינים ושוטפים את כל המרכיבים.',
    'חותכים את הירקות לפי הצורך.',
    'מחממים מחבת או תנור לפי המתכון.',
    'מבשלים/אופים לפי הזמן המומלץ.',
    'מתבלים לפי הטעם ומגישים.',
  ];
}

// Price comparison simulation
// Search recipes by ingredients the user has
export function searchByIngredients(userIngredients) {
  const ingredientDB = extractIngredients.__db || buildIngredientDBMap();
  const results = [];

  for (const [recipeName, recipeIngredients] of Object.entries(ingredientDB)) {
    if (recipeName === 'default') continue;
    const recipeIngNames = recipeIngredients.map(i => i.name);
    const matched = userIngredients.filter(ui =>
      recipeIngNames.some(ri => ri.includes(ui) || ui.includes(ri))
    );
    if (matched.length > 0) {
      const missing = recipeIngNames.filter(ri =>
        !userIngredients.some(ui => ri.includes(ui) || ui.includes(ri))
      );
      const meta = RECIPE_META[recipeName] || {};
      results.push({
        recipeName,
        matchedCount: matched.length,
        totalIngredients: recipeIngNames.length,
        matchPercent: Math.round((matched.length / recipeIngNames.length) * 100),
        matched,
        missing,
        cuisine: meta.cuisine || 'אחר',
        difficulty: meta.difficulty || 'בינוני',
        maxTime: meta.maxTime || 30,
      });
    }
  }

  return results.sort((a, b) => b.matchPercent - a.matchPercent);
}

// Helper to get ingredient DB as a map
function buildIngredientDBMap() {
  const map = {};
  const testRecipes = [
    'שניצל', 'חומוס', 'שקשוקה', 'פסטה', 'עוגת שוקולד', 'פלאפל',
    'מרק עוף', 'לזניה', 'סלט קיסר', 'בורקס', 'קוסקוס', 'חציל',
    'כנאפה', 'מוסקה', 'מלווח', "ג'חנון", 'סביח', 'פיצה', 'טאקו',
    'סושי', 'קארי', 'שווארמה', 'קובה', "מג'דרה", 'פריטטה', 'המבורגר',
  ];
  for (const name of testRecipes) {
    map[name] = extractIngredients(name);
  }
  extractIngredients.__db = map;
  return map;
}

export function comparePrices(ingredients) {
  const stores = [
    { name: 'רמי לוי', logo: '🛒', color: '#e74c3c', orderUrl: 'https://www.rframi-levy.co.il/' },
    { name: 'שופרסל', logo: '🏪', color: '#3498db', orderUrl: 'https://www.shufersal.co.il/online/he/' },
    { name: 'יינות ביתן', logo: '🍷', color: '#9b59b6', orderUrl: 'https://www.ybitan.co.il/' },
    { name: 'חצי חינם', logo: '💰', color: '#2ecc71', orderUrl: 'https://www.hazi-hinam.co.il/' },
    { name: 'מגה', logo: '🏬', color: '#f39c12', orderUrl: 'https://www.mega.co.il/' },
  ];

  const priceComparison = stores.map(store => {
    const baseMultiplier = 0.8 + Math.random() * 0.5;
    const items = ingredients.map(ing => {
      const basePrice = getBasePrice(ing.name);
      const price = Math.round(basePrice * baseMultiplier * 100) / 100;
      return {
        name: ing.name,
        amount: ing.amount,
        price,
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    return {
      ...store,
      items,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  });

  // Sort by total price
  priceComparison.sort((a, b) => a.totalPrice - b.totalPrice);

  return priceComparison;
}

function getBasePrice(ingredientName) {
  const prices = {
    'חזה עוף': 35, 'ביצים': 12, 'פירורי לחם': 8, 'קמח': 5,
    'שמן לטיגון': 15, 'מלח': 3, 'פלפל שחור': 6, 'פפריקה': 5,
    'גרגירי חומוס': 12, 'טחינה גולמית': 18, 'לימון': 4, 'שום': 5,
    'שמן זית': 22, 'כמון': 7, 'סודה לשתייה': 4, 'עגבניות': 8,
    'בצל': 4, 'פלפל חריף': 3, 'רסק עגבניות': 6, 'פפריקה מתוקה': 5,
    'מלח ופלפל': 5, 'פסטה': 10, 'שמנת מתוקה': 12, 'פרמזן': 25,
    'פטריות': 15, 'בזיליקום טרי': 8, 'שוקולד מריר': 18, 'חמאה': 14,
    'סוכר': 6, 'אבקת אפייה': 4, 'קקאו': 12, 'תמצית וניל': 8,
    'פטרוזיליה': 5, 'כוסברה': 5, 'כורכום': 7, 'שמן לטיגון עמוק': 18,
    'עוף שלם': 45, 'גזר': 5, 'סלרי': 6, 'שורש פטרוזיליה': 4,
    'אטריות': 8, 'דפי לזניה': 12, 'בשר טחון': 40, 'מוצרלה': 20,
    'רוטב בשמל': 15, 'אורגנו': 6, 'חסה רומית': 10, 'קרוטונים': 8,
    'אנשובי': 18, 'חרדל דיז\'ון': 12, 'מיץ לימון': 6, 'בצק עלים': 15,
    'גבינה בולגרית': 12, 'תפוחי אדמה': 6, 'שמיר': 5, 'שומשום': 8,
    'קוסקוס': 10, 'חומוס מבושל': 8, 'צימוקים': 10, 'חריסה': 12,
    'קישוא': 6, 'חציל': 7, 'קדאיף': 20, 'גבינת עכאווי': 30,
    'מי ורדים': 10, 'פיסטוקים': 35, 'אגוז מוסקט': 10, 'מרגרינה': 10,
    'שמרים יבשים': 4, 'ביצה': 4, 'דבש': 15, 'ביצים לגריסה': 12,
    'ביצים קשות': 8, 'עגבנייה': 4, 'מלפפון': 3, 'פיתה': 5,
    'אמבה': 12, 'חריף': 6, 'רוטב עגבניות': 8, 'בזיליקום': 8,
    'טורטייה': 15, 'אבוקדו': 8, 'פפריקה מעושנת': 10, 'אורז סושי': 18,
    'דפי נורי': 15, 'סלמון טרי': 55, 'חומץ אורז': 12, 'רוטב סויה': 10,
    'וואסבי': 15, 'חלב קוקוס': 12, 'משחת קארי': 18, 'ג\'ינג\'ר': 6,
    'פלפל אדום': 5, 'אורז': 8, 'חזה הודו': 35, 'טחינה': 18,
    'חומץ': 6, 'בורגול דק': 10, 'צנוברים': 40, 'בהרט': 8,
    'עדשים ירוקות': 10, 'גבינה צהובה': 15,
    'לחמניות המבורגר': 12, 'בשר טחון (70/30)': 45, 'חסה': 8,
    'מלפפון חמוץ': 8, 'גבינה צהובה / צ\'דר': 18, 'קטשופ': 10,
    'חרדל': 10, 'שמן לצלייה': 12,
  };

  return prices[ingredientName] || 8 + Math.random() * 10;
}
