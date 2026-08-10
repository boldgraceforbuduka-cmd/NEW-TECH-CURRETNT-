// components/ui/ArticleGrid.tsx
'use client';
import { motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { Skeleton } from './Skeleton';

interface ArticleGridProps {
  articles: any[];
  loading?: boolean;
  variant?: 'featured' | 'standard' | 'trending';
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ArticleGrid({ articles, loading = false, variant = 'standard' }: ArticleGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[5/3] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles found.</p>
        <p className="text-sm text-muted-foreground mt-2">Check back later for new content.</p>
      </div>
    );
  }

  // For trending variant
  if (variant === 'trending') {
    return (
      <div className="space-y-1 divide-y divide-border/40">
        {articles.map((article, idx) => (
          <ArticleCard key={article.id || article.url} article={article} variant="trending" index={idx} />
        ))}
      </div>
    );
  }

  // For featured variant
  if (variant === 'featured') {
    const featured = articles[0];
    return <ArticleCard article={featured} variant="featured" />;
  }

  // Standard grid
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {articles.map((article, idx) => (
        <motion.div key={article.id || article.url} variants={item}>
          <ArticleCard article={article} variant="standard" index={idx} />
        </motion.div>
      ))}
    </motion.div>
  );
}