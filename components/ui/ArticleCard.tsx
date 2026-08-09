'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Article } from '@/types/article';
import { FollowButton } from './FollowButton';
import { BookmarkButton } from './BookmarkButton';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgH = variant === 'compact' ? 'h-36' : 'h-48';

  const slug = generateSlug(article.title);

  const getTimeAgo = (date: string | undefined) => {
    if (!date) return 'Recently';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Recently';
      return formatDistanceToNow(d, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <Link href={`/news/${slug}`}>
        <div className={`relative ${imgH} bg-muted overflow-hidden`}>
          {article.image_url && !imageError ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary/10 to-gold/10">
              📰
            </div>
          )}
          <span className="absolute top-2 left-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm border border-border">
            {article.category || 'General'}
          </span>
          {article.is_pinned && (
            <span className="absolute top-2 right-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold text-background">
              ★ Editor's Pick
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>{article.source || 'Tech Current'}</span>
            <span>·</span>
            <span>{getTimeAgo(article.published_at)}</span>
            <span>·</span>
            <span>{article.reading_time || 3} min read</span>
          </div>
          <h3 className="font-heading font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {variant !== 'compact' && (
            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
              {article.description || ''}
            </p>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="p-1.5 -m-1.5 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-400 text-red-400' : ''}`} />
          </button>
          <BookmarkButton articleId={article.id || article.url || ''} />
          <button className="p-1.5 -m-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <FollowButton topic={article.category || 'general'} />
          <span className="text-xs text-muted-foreground">
            {article.author || 'Tech Current'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}