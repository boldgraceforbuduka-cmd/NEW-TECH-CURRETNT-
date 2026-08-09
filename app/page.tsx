'use client';
import { useState, useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { FeaturedSection } from '@/components/sections/FeaturedSection';
import { TrendingCarousel } from '@/components/sections/TrendingCarousel';
import { CategorySection } from '@/components/sections/CategorySection';
import { NewsletterSignup } from '@/components/sections/NewsletterSignup';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<'for-you' | 'trending' | 'following'>('for-you');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      try {
        let data;
        if (feedType === 'for-you' && user) {
          // Fetch personalized feed
          const res = await fetch('/api/feed/personalized');
          data = await res.json();
        } else if (feedType === 'following' && user) {
          // Fetch articles from followed topics/sources (we'll implement later)
          // For now, fallback to trending
          data = await fetchArticles({ category: 'general', limit: 20, sort: 'trending' });
        } else {
          // Trending
          data = await fetchArticles({ category: 'general', limit: 20, sort: 'trending' });
        }
        setArticles(data || []);
      } catch (error) {
        console.error('Failed to load feed:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [feedType, user]);

  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* Feed Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={feedType === 'for-you' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFeedType('for-you')}
            className="rounded-full"
          >
            For You
          </Button>
          <Button
            variant={feedType === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFeedType('trending')}
            className="rounded-full"
          >
            Trending
          </Button>
          <Button
            variant={feedType === 'following' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFeedType('following')}
            className="rounded-full"
          >
            Following
          </Button>
        </div>
        {/* Feed Content */}
        <ArticleGrid articles={articles} loading={loading} />
      </div>
      <NewsletterSignup />
    </main>
  );
}