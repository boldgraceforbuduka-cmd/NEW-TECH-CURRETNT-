'use client';
import Link from 'next/link';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

import { Article } from '@/types/article';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  category: string;
}

export function CategorySection({ title, articles, category }: CategorySectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-heading font-bold">{title}</h3>
        <Link href={`/${category}`}>
          <Button variant="ghost" className="gap-2">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.slice(0, 4).map((article: Article) => (
          <ArticleCard key={article.url} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}