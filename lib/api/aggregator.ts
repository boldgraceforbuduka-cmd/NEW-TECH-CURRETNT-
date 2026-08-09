// lib/api/aggregator.ts
import { parseRSS } from './rss';
import { sources } from './sources';

export async function aggregateNews(category?: string) {
  const srcs = category ? sources.filter((s) => s.category === category) : sources;

  const results = await Promise.allSettled(
    srcs.map(async (source) => {
      try {
        if (source.type === 'rss') {
          return await parseRSS(source.url, source.category, source.name);
        }
        return [];
      } catch {
        return [];
      }
    })
  );

  const articles: Awaited<ReturnType<typeof parseRSS>> = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  });

  const unique = Array.from(new Map(articles.map((a) => [a.url, a])).values());
  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return unique;
}