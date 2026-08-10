// components/sections/FeaturedSection.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Article } from '@/types/article';

interface FeaturedSectionProps {
  articles: Article[];
}

export function FeaturedSection({ articles }: FeaturedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!articles || articles.length === 0) return null;

  const featured = articles[0];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="container mx-auto px-4 py-12"
    >
      <h2 className="text-2xl font-heading font-bold mb-6">Featured Story</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleCard article={featured} variant="featured" />
        </div>
        <div className="space-y-4">
          {articles.slice(1, 3).map((article) => (
            <ArticleCard key={article.url} article={article} variant="standard" />
          ))}
        </div>
      </div>
    </motion.section>
  );
}