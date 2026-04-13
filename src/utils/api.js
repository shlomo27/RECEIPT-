const getUserId = () => localStorage.getItem('recipe_ai_user_id') || 'anonymous';

const headers = () => ({
  'Content-Type': 'application/json',
  'X-User-Id': getUserId(),
});

export async function searchRecipes(query, filters = {}) {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query, filters }),
  });
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function trackClick(siteName, siteUrl, recipeTitle, chefName) {
  const res = await fetch('/api/track-click', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ siteName, siteUrl, recipeTitle, chefName }),
  });
  return res.json();
}

export async function getIngredients(recipeTitle, recipeUrl) {
  const res = await fetch('/api/ingredients', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ recipeTitle, recipeUrl }),
  });
  if (!res.ok) throw new Error('Failed to extract ingredients');
  return res.json();
}

export async function comparePrices(ingredients) {
  const res = await fetch('/api/compare-prices', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) throw new Error('Failed to compare prices');
  return res.json();
}

export async function getPreferences() {
  const res = await fetch('/api/preferences', {
    headers: { 'X-User-Id': getUserId() },
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch('/api/history', {
    headers: { 'X-User-Id': getUserId() },
  });
  return res.json();
}

// --- Favorites ---
export async function getFavorites() {
  const res = await fetch('/api/favorites', { headers: headers() });
  if (!res.ok) throw new Error('Failed to load favorites');
  return res.json();
}

export async function addFavorite(recipe) {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ recipe }),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

export async function removeFavorite(recipeUrl) {
  const res = await fetch('/api/favorites', {
    method: 'DELETE',
    headers: headers(),
    body: JSON.stringify({ recipeUrl }),
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
}

export async function checkFavorite(url) {
  const res = await fetch(`/api/favorites/check?url=${encodeURIComponent(url)}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error('Failed to check favorite');
  return res.json();
}

// --- Shopping Lists ---
export async function getShoppingLists() {
  const res = await fetch('/api/shopping-lists', { headers: headers() });
  if (!res.ok) throw new Error('Failed to load shopping lists');
  return res.json();
}

export async function saveShoppingList(name, items) {
  const res = await fetch('/api/shopping-lists', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, items }),
  });
  if (!res.ok) throw new Error('Failed to save shopping list');
  return res.json();
}

export async function deleteShoppingList(id) {
  const res = await fetch(`/api/shopping-lists/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Failed to delete shopping list');
  return res.json();
}

// --- Search by ingredients ---
export async function searchByIngredients(ingredients) {
  const res = await fetch('/api/search-by-ingredients', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) throw new Error('Failed to search by ingredients');
  return res.json();
}

// --- AI Chat ---
export async function sendChatMessage(message, recipeContext) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ message, recipeContext }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}
