// lib/api/client.ts
import { Article } from '@/types/article';

export async function fetchArticles(params: any = {}): Promise<Article[]> {
  const {
    category = 'general',
    limit = 20,
    sort = 'latest',
    pinned = false,
    page = 1,
  } = params;

  let baseUrl: string;

  if (typeof window !== 'undefined') {
    // Browser: use the current deployed domain
    baseUrl = window.location.origin;
  } else {
    // Server: use the deployment URL
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    baseUrl = appUrl;
  }

  const url = new URL('/api/news', baseUrl);

  if (category) {
    url.searchParams.set('category', category);
  }

  if (limit) {
    url.searchParams.set('limit', String(limit));
  }

  if (sort) {
    url.searchParams.set('sort', sort);
  }

  if (pinned) {
    url.searchParams.set('pinned', 'true');
  }

  if (page) {
    url.searchParams.set('page', String(page));
  }

  const res = await fetch(url.toString(), {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch articles: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  if (
    data &&
    typeof data === 'object' &&
    'articles' in data &&
    Array.isArray(data.articles)
  ) {
    return data.articles;
  }

  if (Array.isArray(data)) {
    return data;
  }

  console.warn('Unexpected API response format:', data);

  return [];
}