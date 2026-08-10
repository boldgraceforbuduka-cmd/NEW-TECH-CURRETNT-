'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';
import { FeaturedSection } from '@/components/sections/FeaturedSection';
import { TrendingCarousel } from '@/components/sections/TrendingCarousel';
import { CategorySection } from '@/components/sections/CategorySection';
import { NewsletterSignup } from '@/components/sections/NewsletterSignup';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { shuffleArray } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

export default function HomePage() {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<'trending' | 'following'>('trending');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const loadFeed = useCallback(async (pageNum: number, reset = true) => {
    if (reset) setLoading(true);
    else setIsLoadingMore(true);

    try {
      let data: any[] = [];
      let moreAvailable = true;

      if (feedType === 'following' && user) {
        const res = await fetch('/api/feed/personalized');
        if (!res.ok) throw new Error('Failed to fetch personalized feed');
        const result = await res.json();
        data = result.articles || [];
        moreAvailable = false;
      } else {
        data = await fetchArticles({
          category: 'general',
          limit: 20,
          page: pageNum,
          sort: 'trending',
        });
        moreAvailable = data && data.length === 20;
      }

      if (reset) {
        const shuffled = shuffleArray(data || []);
        setArticles(shuffled);
      } else {
        setArticles((prev) => [...prev, ...(data || [])]);
      }

      setHasMore(moreAvailable);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [feedType, user]);

  useEffect(() => {
    setPage(1);
    setArticles([]);
    loadFeed(1, true);
  }, [feedType, user, loadFeed]);

  useEffect(() => {
    if (inView && hasMore && !loading && !isLoadingMore && feedType === 'trending') {
      const nextPage = page + 1;
      setPage(nextPage);
      loadFeed(nextPage, false);
    }
  }, [inView, hasMore, loading, isLoadingMore, page, loadFeed, feedType]);

  const showSignInPrompt = feedType === 'following' && !user;

  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* Feed Tabs – refined */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={feedType === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFeedType('trending')}
            className="rounded-full text-sm"
          >
            Trending
          </Button>
          <Button
            variant={feedType === 'following' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFeedType('following')}
            className="rounded-full text-sm"
          >
            Following
          </Button>
        </div>

        {showSignInPrompt && (
          <div className="bg-muted/30 border border-border rounded-xl p-6 mb-6 text-center">
            <p className="text-muted-foreground mb-2">
              Sign in to see articles based on your followed topics.
            </p>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        )}

        <ArticleGrid articles={articles} loading={loading} />

        {!loading && hasMore && feedType === 'trending' && (
          <div ref={ref} className="h-10 flex items-center justify-center">
            {isLoadingMore ? (
              <div className="text-muted-foreground text-sm animate-pulse">Loading more...</div>
            ) : (
              <div className="text-muted-foreground text-sm">Scroll for more</div>
            )}
          </div>
        )}

        {!hasMore && articles.length > 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            You've reached the end 🎉
          </div>
        )}
      </div>
      <NewsletterSignup />
    </main>
  );
}