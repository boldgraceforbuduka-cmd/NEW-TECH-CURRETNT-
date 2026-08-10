// lib/api/sample.ts
import { Article } from '@/types/article';

export function getSampleArticles(category?: string): Article[] {
  const all: Article[] = [
    {
      id: '1',
      url: 'https://techcurrent.com/ai-breakthrough',
      title: 'AI Breakthrough: New Model Achieves Human-Level Reasoning',
      description: 'Researchers have developed a new AI model that demonstrates human-like reasoning capabilities.',
      content: '<p>Full article content here...</p>',
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      source: 'Tech Current',
      author: 'AI Research Team',
      published_at: new Date().toISOString(),
      category: 'ai',
      tags: ['AI', 'Machine Learning'],
      reading_time: 4,
      is_pinned: true,
      likes: 156,
      bookmarks: 89,
    },
    // ... add more sample articles for each category
    // (copy from your existing sample generator)
  ];

  if (category && category !== 'general') {
    return all.filter(a => a.category === category);
  }
  return all;
}