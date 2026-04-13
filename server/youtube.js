import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API key from .env file
let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/YOUTUBE_API_KEY=(.+)/);
    if (match) YOUTUBE_API_KEY = match[1].trim();
  }
} catch (e) {
  console.error('Failed to read .env:', e.message);
}

export async function searchYouTube(query, maxResults = 3) {
  if (!YOUTUBE_API_KEY) {
    console.warn('No YouTube API key configured');
    return [];
  }

  try {
    const searchQuery = encodeURIComponent(`מתכון ${query}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=${maxResults}&relevanceLanguage=iw&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error('YouTube API error:', res.status, await res.text());
      return [];
    }

    const data = await res.json();

    return (data.items || []).map(item => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      snippet: item.snippet.description || item.snippet.title,
      siteName: 'YouTube',
      siteUrl: 'https://www.youtube.com',
      chefName: item.snippet.channelTitle,
      rating: 4.8,
      cookTime: 'צפה בסרטון',
      difficulty: 'סרטון',
      image: item.snippet.thumbnails?.medium?.url || null,
      contentType: 'video',
      platform: 'youtube',
      videoId: item.id.videoId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (err) {
    console.error('YouTube search error:', err.message);
    return [];
  }
}

export async function searchTikTok(query) {
  // TikTok doesn't have a free public API, so we link to search
  const searchQuery = encodeURIComponent(`מתכון ${query}`);
  return [
    {
      title: `${query} - סרטונים פופולריים | TikTok`,
      url: `https://www.tiktok.com/search?q=${searchQuery}`,
      snippet: `חפש סרטוני ${query} בטיקטוק - מתכונים קצרים וויראליים`,
      siteName: 'TikTok',
      siteUrl: 'https://www.tiktok.com',
      chefName: 'TikTok',
      rating: 4.7,
      cookTime: 'סרטונים קצרים',
      difficulty: 'סרטון',
      image: null,
      contentType: 'video',
      platform: 'tiktok',
    },
  ];
}

export function searchInstagram(query) {
  const tag = query.replace(/\s+/g, '');
  return [
    {
      title: `${query} - ריסים ופוסטים | Instagram`,
      url: `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`,
      snippet: `מתכוני ${query} באינסטגרם - ריסים, תמונות וסרטונים מהשפים הכי פופולריים`,
      siteName: 'Instagram',
      siteUrl: 'https://www.instagram.com',
      chefName: 'Instagram',
      rating: 4.8,
      cookTime: 'ריסים ופוסטים',
      difficulty: 'סרטון',
      image: null,
      contentType: 'video',
      platform: 'instagram',
    },
  ];
}
