// lib/api/client.ts
import { Article } from '@/types/article';

export async function fetchArticles(params: any = {}): Promise<Article[]> {
  const { category = 'general', limit = 20, sort = 'latest', pinned = false, page = 1 } = params;

  let baseUrl = '';
  if (typeof window !== 'undefined') {
    baseUrl = window.location.origin;
  } else {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  const url = new URL('/api/news', baseUrl);
  if (category) url.searchParams.set('category', category);
  if (limit) url.searchParams.set('limit', String(limit));
  if (sort) url.searchParams.set('sort', sort);
  if (pinned) url.searchParams.set('pinned', 'true');
  if (page) url.searchParams.set('page', String(page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch articles');
  const data = await res.json();
  
  // ✅ Handle both paginated and non-paginated responses
  if (data && typeof data === 'object' && 'articles' in data && Array.isArray(data.articles)) {
    return data.articles;
  }
  // fallback: if data itself is an array (old format)
  if (Array.isArray(data)) return data;
  
  // If nothing, return empty array
  console.warn('Unexpected API response format:', data);
  return [];
}