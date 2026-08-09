'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ArticleCard } from '@/components/ui/ArticleCard';

import { Article } from '@/types/article';

export function TrendingCarousel({ articles }: { articles: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const total = articles.length;
  const maxIndex = Math.max(0, total - itemsPerView);

  if (!total) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-heading font-bold">Trending Now</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
            disabled={currentIndex >= maxIndex}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
          transition={{ duration: 0.5 }}
          style={{ width: `${(total / itemsPerView) * 100}%` }}
        >
          {articles.map((article: Article) => (
            <div
              key={article.url}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}