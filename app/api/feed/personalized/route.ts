// app/api/feed/personalized/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Article } from '@/types/article';

export const revalidate = 60;

// Local fallback sample generator
function getSampleArticles(category?: string): Article[] {
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
    // Add more sample articles here (copy from your main news route)
  ];
  if (category && category !== 'general') {
    return all.filter(a => a.category === category);
  }
  return all;
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .select('topic')
      .eq('user_id', user.id);
    if (followsError) console.error('Failed to fetch follows:', followsError);
    const followedTopics = follows?.map(f => f.topic) || [];

    const { data: history, error: historyError } = await supabase
      .from('reading_history')
      .select('article_category')
      .eq('user_id', user.id)
      .order('read_at', { ascending: false })
      .limit(10);
    if (historyError) console.error('Failed to fetch reading history:', historyError);
    const readCategories = history?.map(h => h.article_category).filter(Boolean) || [];

    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(100);

    const { data: articles, error: articlesError } = await query;
    if (articlesError) {
      console.error('Failed to fetch articles:', articlesError);
      const fallbackArticles = getSampleArticles('general');
      return NextResponse.json({
        articles: scoreAndSort(fallbackArticles, followedTopics, readCategories),
        userPreferences: { topics: followedTopics, history: readCategories }
      });
    }

    if (!articles || articles.length === 0) {
      const fallbackArticles = getSampleArticles('general');
      return NextResponse.json({
        articles: scoreAndSort(fallbackArticles, followedTopics, readCategories),
        userPreferences: { topics: followedTopics, history: readCategories }
      });
    }

    const scoredArticles = scoreAndSort(articles, followedTopics, readCategories);
    return NextResponse.json({
      articles: scoredArticles.slice(0, 20),
      userPreferences: {
        topics: followedTopics,
        history: readCategories
      }
    });
  } catch (error) {
    console.error('Personalized feed error:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized feed' },
      { status: 500 }
    );
  }
}

function scoreAndSort(
  articles: Article[],
  followedTopics: string[],
  readCategories: string[]
): (Article & { score: number; matchPercentage: string })[] {
  return articles
    .map((article) => {
      let score = 50;
      const category = (article.category || '').toLowerCase();
      const tags = article.tags || [];

      if (followedTopics.some(t => category.includes(t.toLowerCase()))) score += 25;
      if (tags.some(tag => followedTopics.some(t => tag.toLowerCase().includes(t.toLowerCase())))) score += 15;
      if (readCategories.includes(category)) score += 15;
      if (article.is_pinned) score += 10;
      if (article.published_at) {
        const hoursOld = (Date.now() - new Date(article.published_at).getTime()) / (1000 * 3600);
        if (hoursOld < 6) score += 15;
        else if (hoursOld < 24) score += 10;
        else if (hoursOld < 72) score += 5;
      }
      const cappedScore = Math.min(99, Math.max(60, score));
      return {
        ...article,
        score: cappedScore,
        matchPercentage: `${cappedScore}% Match`,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
    });
}