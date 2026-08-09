// app/api/feed/personalized/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/types/article";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userTopics = searchParams.get('topics')?.split(',').filter(Boolean) || [];
  const historyCategory = searchParams.get('historyCategory') || '';

  let followedTopics: string[] = userTopics;
  let followedSources: string[] = [];
  let readCategories: string[] = historyCategory ? [historyCategory] : [];

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("followed_topics, followed_sources")
        .eq("user_id", user.id)
        .single();

      if (prefs) {
        if (prefs.followed_topics?.length) followedTopics = Array.from(new Set([...followedTopics, ...prefs.followed_topics]));
        if (prefs.followed_sources?.length) followedSources = prefs.followed_sources;
      }

      const { data: history } = await supabase
        .from("reading_history")
        .select("article_category")
        .eq("user_id", user.id)
        .order("read_at", { ascending: false })
        .limit(10);

      if (history) {
        const histCats = history.map((h: any) => h.article_category).filter(Boolean);
        readCategories = Array.from(new Set([...readCategories, ...histCats]));
      }
    }
  } catch {
    // Fallback to query params if Supabase auth or DB is unconfigured
  }

  // Fetch articles from internal news endpoint
  let articles: Article[] = [];
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const newsRes = await fetch(`${origin}/api/news?limit=50`);
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      articles = newsData.articles || newsData || [];
    }
  } catch (e) {
    console.error('Failed to fetch base news for personalization:', e);
  }

  // Default fallback topics if none selected
  if (followedTopics.length === 0) {
    followedTopics = ['ai', 'startups', 'programming', 'cybersecurity'];
  }

  // Scoring algorithm
  const scored = articles.map((article: Article) => {
    let score = 50; // base score

    const category = (article.category || '').toLowerCase();
    const tags = article.tags || [];

    // Boost if article category is in followed topics (+25)
    if (followedTopics.some(t => category.includes(t.toLowerCase()))) {
      score += 25;
    }

    // Boost if article tags match followed topics (+15)
    if (tags.some(tag => followedTopics.some(t => tag.toLowerCase().includes(t.toLowerCase())))) {
      score += 15;
    }

    // Boost if article source is in followed sources (+10)
    if (followedSources.includes(article.source || '')) {
      score += 10;
    }

    // Boost if user read articles in this category before (+15)
    if (readCategories.includes(category)) {
      score += 15;
    }

    // Editor's pick / pinned boost (+10)
    if (article.is_pinned) {
      score += 10;
    }

    // Recency boost (up to +15)
    if (article.published_at) {
      const hoursOld = (Date.now() - new Date(article.published_at).getTime()) / (1000 * 3600);
      if (hoursOld < 6) score += 15;
      else if (hoursOld < 24) score += 10;
      else if (hoursOld < 72) score += 5;
    }

    // Cap score percentage at 99%
    const matchPercentage = Math.min(99, Math.max(60, score));

    return {
      ...article,
      score: matchPercentage,
      matchPercentage: `${matchPercentage}% Match`,
    };
  });

  // Sort by score (descending) then by publish date
  scored.sort((a, b) => (b.score - a.score) || (new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()));

  return NextResponse.json({
    articles: scored,
    userPreferences: {
      topics: followedTopics,
      sources: followedSources,
      historyCategories: readCategories,
    }
  });
}
