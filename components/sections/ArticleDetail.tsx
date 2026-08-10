'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Heart, Bookmark, Share2, ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { generateSlug, generateSlugFromUrl } from '@/lib/utils'; // ✅ import shared helpers

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const slug = params.slug as string;
        console.log('🔍 Looking for slug:', slug);

        const articles = await fetchArticles({ limit: 100 }) as Article[];
        console.log('📰 Total articles:', articles.length);

        // Log all articles with their slugs
        const articleSlugs = articles.map((a) => ({
          title: a.title,
          url: a.url,
          slugFromUrl: a.url ? generateSlugFromUrl(a.url) : null,
          slugFromTitle: generateSlug(a.title), // ✅ use shared generateSlug
        }));
        console.log('📋 All article slugs:', articleSlugs);

        // Find article by matching slug from URL first, then title
        const found = articles.find((a) => {
          // Try URL-based slug first
          if (a.url) {
            const urlSlug = generateSlugFromUrl(a.url);
            if (urlSlug === slug) {
              console.log('✅ MATCH FOUND (URL):', a.title);
              return true;
            }
          }
          // Fallback to title-based slug
          const titleSlug = generateSlug(a.title);
          if (titleSlug === slug) {
            console.log('✅ MATCH FOUND (Title):', a.title);
            return true;
          }
          return false;
        });

        console.log('🏆 Final result:', found ? found.title : 'Not found');
        setArticle(found || null);
      } catch (error) {
        console.error('Failed to load article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [params.slug]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-muted rounded-2xl" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        <p className="text-sm text-muted-foreground mt-2">Slug: {params.slug}</p>
        <Link href="/news" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
          {article.category || 'General'}
        </span>
        {article.is_pinned && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold text-background">
            ★ Editor's Pick
          </span>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{article.author || 'Tech Current'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{getTimeAgo(article.published_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{article.reading_time || 3} min read</span>
        </div>
        <span>·</span>
        <span>{article.source || 'Tech Current'}</span>
      </div>

      {article.image_url && (
        <div className="mb-8 rounded-2xl overflow-hidden relative w-full h-[300px] md:h-[500px]">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-li:text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: article.content || article.description || '<p>Full article content coming soon...</p>'
        }}
      />

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
          {article.tags.map((tag: string, index: number) => (
            <span key={index} className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-red-400 transition-colors">
          <Heart className="h-5 w-5" />
          <span>{article.likes || 0}</span>
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Bookmark className="h-5 w-5" />
          <span>Bookmark</span>
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}