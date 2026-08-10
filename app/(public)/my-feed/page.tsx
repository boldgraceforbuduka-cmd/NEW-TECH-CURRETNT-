// app/(public)/my-feed/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button'; // ✅ import Button

export default function MyFeedPage() {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFollows = async () => {
      const { data } = await supabase
        .from('follows')
        .select('topic')
        .eq('user_id', user.id);
      const topics = data?.map(f => f.topic) || [];
      setFollowedTopics(topics);
    };

    const fetchFeed = async () => {
      setLoading(true);
      try {
        let data = await fetchArticles({ category: 'general', limit: 30 });
        if (followedTopics.length > 0) {
          data = data.filter(article =>
            followedTopics.includes(article.category || '')
          );
        }
        setArticles(data);
      } catch (error) {
        console.error('Failed to load feed:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollows().then(() => fetchFeed());
  }, [user, followedTopics]); // ✅ added followedTopics to dependency array

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Sign in to see your feed</h1>
        <p className="text-muted-foreground mb-6">Follow topics to get personalised articles.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-8 w-8 text-gold" />
        <h1 className="text-4xl font-heading font-bold">My Feed</h1>
      </div>
      {followedTopics.length === 0 && (
        <div className="bg-muted/30 border border-border rounded-xl p-6 mb-8">
          <p className="text-sm text-muted-foreground">
            You aren't following any topics yet. Follow topics like "AI" or "Startups" to get personalised articles.
          </p>
        </div>
      )}
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}