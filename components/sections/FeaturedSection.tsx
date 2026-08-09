'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

import { Article } from '@/types/article';

export function FeaturedSection({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-heading font-bold">Featured Stories</h2>
        <Link href="/news">
          <Button variant="ghost" className="gap-2">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Link href={`/news/${featured.slug || encodeURIComponent(featured.url || '')}`}>
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <div className="aspect-[16/9] bg-muted">
                {featured.image_url ? (
                  <Image src={featured.image_url} alt={featured.title} fill loading="lazy" sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary/10 to-gold/10">📰</div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary backdrop-blur-sm">
                    {featured.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {featured.published_at ? new Date(featured.published_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground mt-2 line-clamp-2">{featured.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{featured.source}</span>
                  <span>·</span>
                  <span>{featured.reading_time || 3} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
        <div className="space-y-4">
          {rest.slice(0, 2).map((article: Article, index: number) => (
            <motion.div
              key={article.url}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
            >
              <ArticleCard article={article} variant="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}