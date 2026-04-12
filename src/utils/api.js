const getUserId = () => localStorage.getItem('recipe_ai_user_id') || 'anonymous';

const headers = () => ({
  'Content-Type': 'application/json',
  'X-User-Id': getUserId(),
});

export async function searchRecipes(query) {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query }),
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
