'use client';
import { ArticleCard } from './ArticleCard';
import { Skeleton } from './Skeleton';

interface ArticleGridProps {
  articles: any[];
  loading?: boolean;
}

export function ArticleGrid({ articles, loading = false }: ArticleGridProps) {
  // Show loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Show empty state
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles found.</p>
        <p className="text-sm text-muted-foreground mt-2">Check back later for new content.</p>
      </div>
    );
  }

  // Show articles
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id || article.url} article={article} />
      ))}
    </div>
  );
}