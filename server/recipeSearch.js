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

// Simulated search results (in production, use a real search API like Google Custom Search or Bing)
// This provides realistic demo data
function generateSearchResults(query) {
  const recipeSites = [
    {
      title: `${query} - מתכון מושלם | פודיש`,
      url: `https://www.foodish.co.il/recipe/${encodeURIComponent(query)}`,
      snippet: `מתכון מעולה ל${query} עם הסבר מפורט שלב אחר שלב. מתכון קל להכנה שכולם יאהבו.`,
      siteName: 'פודיש',
      siteUrl: 'https://www.foodish.co.il',
      chefName: 'שף יוסי שטרית',
      rating: 4.8,
      cookTime: '45 דקות',
      difficulty: 'בינוני',
      image: null,
    },
    {
      title: `מתכון ${query} של השולחן | קל וטעים`,
      url: `https://www.hashulchan.co.il/recipe/${encodeURIComponent(query)}`,
      snippet: `${query} - מתכון מסורתי ואותנטי. מומלץ לארוחת שישי עם כל המשפחה.`,
      siteName: 'השולחן',
      siteUrl: 'https://www.hashulchan.co.il',
      chefName: 'שפית נועה דנון',
      rating: 4.6,
      cookTime: '60 דקות',
      difficulty: 'קל',
      image: null,
    },
    {
      title: `Best ${query} Recipe - Food Network`,
      url: `https://www.foodnetwork.com/recipes/${encodeURIComponent(query.replace(/\s/g, '-'))}`,
      snippet: `The ultimate ${query} recipe. Tried and tested by our expert chefs. Get the perfect results every time.`,
      siteName: 'Food Network',
      siteUrl: 'https://www.foodnetwork.com',
      chefName: 'Chef Gordon Ramsay',
      rating: 4.9,
      cookTime: '30 דקות',
      difficulty: 'מתקדם',
      image: null,
    },
    {
      title: `${query} Recipe | AllRecipes`,
      url: `https://www.allrecipes.com/recipe/${encodeURIComponent(query)}`,
      snippet: `A community favorite ${query} recipe with over 2000 reviews. Simple ingredients and easy instructions.`,
      siteName: 'AllRecipes',
      siteUrl: 'https://www.allrecipes.com',
      chefName: null,
      rating: 4.5,
      cookTime: '50 דקות',
      difficulty: 'קל',
      image: null,
    },
    {
      title: `מתכון ${query} מהיר וקל | 10 דקות`,
      url: `https://www.10dakot.co.il/recipe/${encodeURIComponent(query)}`,
      snippet: `מתכון מהיר ל${query} שאפשר להכין תוך 10 דקות! מושלם לימי חול עמוסים.`,
      siteName: '10 דקות',
      siteUrl: 'https://www.10dakot.co.il',
      chefName: 'שף אייל שני',
      rating: 4.3,
      cookTime: '10 דקות',
      difficulty: 'קל מאוד',
      image: null,
    },
    {
      title: `${query} - Bon Appétit`,
      url: `https://www.bonappetit.com/recipe/${encodeURIComponent(query.replace(/\s/g, '-'))}`,
      snippet: `Our test kitchen's best ${query}. This recipe has been perfected over dozens of attempts.`,
      siteName: 'Bon Appétit',
      siteUrl: 'https://www.bonappetit.com',
      chefName: 'Chef Claire Saffitz',
      rating: 4.7,
      cookTime: '40 דקות',
      difficulty: 'בינוני',
      image: null,
    },
    {
      title: `${query} מסורתי | על השולחן`,
      url: `https://www.al-hashulchan.co.il/recipe/${encodeURIComponent(query)}`,
      snippet: `מתכון מסורתי ל${query} כמו של סבתא. טעם אותנטי שמזכיר בית.`,
      siteName: 'על השולחן',
      siteUrl: 'https://www.al-hashulchan.co.il',
      chefName: 'שפית מירב גולן',
      rating: 4.4,
      cookTime: '55 דקות',
      difficulty: 'בינוני',
      image: null,
    },
    {
      title: `Easy ${query} | Simply Recipes`,
      url: `https://www.simplyrecipes.com/recipes/${encodeURIComponent(query.replace(/\s/g, '_'))}`,
      snippet: `A straightforward ${query} recipe with step-by-step photos. Perfect for beginners and experienced cooks alike.`,
      siteName: 'Simply Recipes',
      siteUrl: 'https://www.simplyrecipes.com',
      chefName: null,
      rating: 4.6,
      cookTime: '35 דקות',
      difficulty: 'קל',
      image: null,
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

export function searchRecipes(query, preferences) {
  let results = generateSearchResults(query);

  // Sort by user preferences
  results = sortByPreference(results, preferences);

  // Generate personalized message
  const personalizedMessages = getPersonalizedMessage(preferences, results);

  return {
    results,
    personalizedMessages,
    totalResults: results.length,
    query,
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

// Price comparison simulation
export function comparePrices(ingredients) {
  const stores = [
    { name: 'רמי לוי', logo: '🛒', color: '#e74c3c' },
    { name: 'שופרסל', logo: '🏪', color: '#3498db' },
    { name: 'יינות ביתן', logo: '🍷', color: '#9b59b6' },
    { name: 'חצי חינם', logo: '💰', color: '#2ecc71' },
    { name: 'מגה', logo: '🏬', color: '#f39c12' },
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
    'חזה עוף': 35,
    'ביצים': 12,
    'פירורי לחם': 8,
    'קמח': 5,
    'שמן לטיגון': 15,
    'מלח': 3,
    'פלפל שחור': 6,
    'פפריקה': 5,
    'גרגירי חומוס': 12,
    'טחינה גולמית': 18,
    'לימון': 4,
    'שום': 5,
    'שמן זית': 22,
    'כמון': 7,
    'סודה לשתייה': 4,
    'עגבניות': 8,
    'בצל': 4,
    'פלפל חריף': 3,
    'רסק עגבניות': 6,
    'פפריקה מתוקה': 5,
    'מלח ופלפל': 5,
    'פסטה': 10,
    'שמנת מתוקה': 12,
    'פרמזן': 25,
    'פטריות': 15,
    'בזיליקום טרי': 8,
    'שוקולד מריר': 18,
    'חמאה': 14,
    'סוכר': 6,
    'אבקת אפייה': 4,
    'קקאו': 12,
    'תמצית וניל': 8,
  };

  return prices[ingredientName] || 8 + Math.random() * 10;
}
