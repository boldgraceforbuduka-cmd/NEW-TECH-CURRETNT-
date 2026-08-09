// lib/api/rss.ts
import Parser from 'rss-parser';

const parser = new Parser();

export async function parseRSS(feedUrl: string, category: string, sourceName: string) {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, 15).map((item) => ({
      url: item.link || '',
      title: item.title || '',
      description: item.contentSnippet || item.summary || '',
      content: item.content || '',
      imageUrl: item.enclosure?.url || item.itunes?.image || '',
      source: sourceName,
      author: item.creator || '',
      publishedAt: item.pubDate && !isNaN(new Date(item.pubDate).getTime()) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      category,
      tags: item.categories || [],
      readingTime: Math.ceil((item.content?.length || 0) / 1000) || 3,
    }));
  } catch (error) {
    console.error('RSS error', feedUrl, error);
    return [];
  }
}