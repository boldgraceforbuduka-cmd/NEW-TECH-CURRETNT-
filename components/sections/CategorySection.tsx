// components/sections/CategorySection.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!articles || articles.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-heading font-bold">{title}</h3>
        <Link href={`/${category}`}>
          <Button variant="ghost" className="gap-2">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.slice(0, 4).map((article) => (
          <ArticleCard key={article.url} article={article} variant="standard" />
        ))}
      </div>
    </motion.div>
  );
}