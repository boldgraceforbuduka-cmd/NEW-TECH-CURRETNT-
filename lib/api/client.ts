// lib/api/client.ts
import { Article } from '@/types/article';

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return APP_URL;
};

export async function fetchArticles(params: any = {}): Promise<Article[]> {
  const {
    category = 'general',
    limit = 20,
    sort = 'latest',
    pinned = false,
    page = 1,
  } = params;

  const baseUrl = getBaseUrl();

  const url = new URL('/api/news', baseUrl);
  if (category) url.searchParams.set('category', category);
  if (limit) url.searchParams.set('limit', String(limit));
  if (sort) url.searchParams.set('sort', sort);
  if (pinned) url.searchParams.set('pinned', 'true');
  if (page) url.searchParams.set('page', String(page));

  const res = await fetch(url.toString(), { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`API returned ${res.status}: ${res.statusText}`);
  }

  // ✅ Check content type
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    // Log the first 200 characters of the response to debug
    const text = await res.text();
    console.error('Unexpected non‑JSON response from /api/news:', text.slice(0, 200));
    throw new Error('API returned HTML instead of JSON – please check server logs');
  }

  const data = await res.json();

  if (data && typeof data === 'object' && 'articles' in data && Array.isArray(data.articles)) {
    return data.articles;
  }
  if (Array.isArray(data)) {
    return data;
  }

  console.warn('Unexpected API response format:', data);
  return [];
}