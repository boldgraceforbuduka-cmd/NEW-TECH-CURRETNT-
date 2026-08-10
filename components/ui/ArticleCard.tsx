'use client';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import { Article } from '@/types/article';
import { FollowButton } from './FollowButton';
import { BookmarkButton } from './BookmarkButton';
import { ShareButtons } from './ShareButtons';
import { generateSlug } from '@/lib/utils'; // ✅ import from utils

// ❌ REMOVED: local generateSlug definition

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'trending';
  index?: number;
}

export function ArticleCard({ article, variant = 'standard', index = 0 }: ArticleCardProps) {
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const slug = generateSlug(article.title); // ✅ uses imported function
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getTimeAgo = (date: string | undefined) => {
    if (!date) return 'Recently';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Recently';
      return formatDistanceToNow(d, { addSuffix: true });
    } catch { return 'Recently'; }
  };

  // ----- FEATURED VARIANT -----
  if (variant === 'featured') {
    return (
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300"
      >
        <Link href={`/news/${slug}`}>
          <div className="relative aspect-[16/9] bg-muted overflow-hidden">
            {article.image_url && !imageError ? (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary/10 to-gold/10">📰</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary backdrop-blur-sm border border-primary/20 mb-2">
                {article.category || 'General'}
              </span>
              <h3 className="text-xl md:text-2xl font-heading font-bold line-clamp-2 text-white drop-shadow">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-white/70 mt-2">
                <span>{article.author || 'Tech Current'}</span>
                <span>·</span>
                <span>{getTimeAgo(article.published_at)}</span>
                <span>·</span>
                <span>{article.reading_time || 3} min read</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="px-4 pb-4 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LikeButton liked={liked} setLiked={setLiked} />
            <BookmarkButton articleId={article.id || article.url || ''} />
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://techcurrent.com'}/news/${slug}`}
              title={article.title}
            />
          </div>
          <FollowButton topic={article.category || 'general'} />
        </div>
      </motion.div>
    );
  }

  // ----- TRENDING VARIANT -----
  if (variant === 'trending') {
    const number = index + 1;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ x: 4 }}
        className="flex items-start gap-4 group py-3 border-b border-border/40 last:border-0"
      >
        <span className="text-3xl font-bold text-primary/30 group-hover:text-primary/60 transition-colors font-heading min-w-[2.5rem]">
          {String(number).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <Link href={`/news/${slug}`} className="block">
            <span className="inline-block text-xs font-medium text-primary/80 mb-1">{article.category}</span>
            <h4 className="font-heading font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{article.source || 'Tech Current'}</span>
              <span>·</span>
              <span>{getTimeAgo(article.published_at)}</span>
            </div>
          </Link>
        </div>
      </motion.div>
    );
  }

  // ----- STANDARD VARIANT (default) -----
  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="group card-premium overflow-hidden"
    >
      <Link href={`/news/${slug}`}>
        <div className="relative aspect-[5/3] bg-muted overflow-hidden">
          {article.image_url && !imageError ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary/10 to-gold/10">📰</div>
          )}
          <span className="absolute top-2 left-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm border border-border/50">
            {article.category || 'General'}
          </span>
          {article.is_pinned && (
            <span className="absolute top-2 right-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold text-black">
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
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {article.description || ''}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center justify-between border-t border-border/40 pt-3">
        <div className="flex items-center gap-2">
          <LikeButton liked={liked} setLiked={setLiked} />
          <BookmarkButton articleId={article.id || article.url || ''} />
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://techcurrent.com'}/news/${slug}`}
            title={article.title}
          />
        </div>
        <FollowButton topic={article.category || 'general'} />
      </div>
    </motion.div>
  );
}

// Helper: Like button with pop animation
function LikeButton({ liked, setLiked }: { liked: boolean; setLiked: (val: boolean) => void }) {
  return (
    <button
      onClick={() => setLiked(!liked)}
      className="p-1.5 -m-1.5 text-muted-foreground hover:text-red-400 transition-colors"
    >
      <motion.div
        animate={{ scale: liked ? [1, 1.5, 1] : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Heart
          className={`h-4 w-4 ${liked ? 'fill-red-400 text-red-400' : ''}`}
        />
      </motion.div>
    </button>
  );
}