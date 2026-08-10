// components/sections/RelatedArticles.tsx
'use client';
import { useEffect, useState } from 'react';
import { Article } from '@/types/article';
import { fetchArticles } from '@/lib/api/client';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface RelatedArticlesProps {
  article: Article;
}

export function RelatedArticles({ article }: RelatedArticlesProps) {
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelated() {
      if (!article) return;
      try {
        // Fetch articles from the same category
        const articles = await fetchArticles({
          category: article.category || 'general',
          limit: 30,
        });

        // Exclude the current article (by id or url)
        const filtered = articles.filter(
          (a) => a.id !== article.id && a.url !== article.url
        );

        // Score by common tags (higher score = more relevant)
        const scored = filtered.map((a) => {
          const commonTags = a.tags?.filter((t) => article.tags?.includes(t)) || [];
          return { ...a, score: commonTags.length };
        });

        // Sort by score descending, then by published date
        scored.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
        });

        setRelated(scored.slice(0, 5));
      } catch (error) {
        console.error('Failed to load related articles:', error);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    }

    loadRelated();
  }, [article]);

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-heading font-bold mb-4">Related Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="text-2xl font-heading font-bold mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {related.map((a) => (
          <ArticleCard key={a.id || a.url} article={a} variant="standard" />
        ))}
      </div>
    </div>
  );
}