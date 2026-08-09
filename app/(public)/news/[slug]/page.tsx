'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Share2, ArrowLeft, Calendar, Clock, User, Volume2, Pause, Square } from 'lucide-react';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { Button } from '@/components/ui/Button';

// Helper function to generate slug from URL
function generateSlugFromUrl(url: string): string {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.split('?')[0];
}

// Helper function to generate slug from title (fallback)
function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  useEffect(() => {
    async function loadArticle() {
      try {
        const slug = params.slug as string;
        console.log('🔍 Looking for slug:', slug);

        const articles: Article[] = await fetchArticles({ limit: 100 });
        console.log('📰 Total articles:', articles.length);

        // Find article by matching slug from URL first, then title
        const found = articles.find((a: Article) => {
          // Try URL-based slug first
          if (a.url) {
            const urlSlug = generateSlugFromUrl(a.url);
            if (urlSlug === slug) {
              console.log('✅ MATCH FOUND (URL):', a.title);
              return true;
            }
          }
          // Fallback to title-based slug
          const titleSlug = generateSlugFromTitle(a.title);
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

  const handleAudioPlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPausedAudio) {
      window.speechSynthesis.resume();
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${article?.title}. ${article?.description || ''}. ${article?.content?.replace(/<[^>]*>?/gm, '') || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const handleAudioPause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
      setIsPausedAudio(true);
    }
  };

  const handleAudioStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }
  };

  const structuredData = article ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.description,
    'image': [article.image_url],
    'datePublished': article.published_at,
    'dateModified': article.published_at,
    'author': [{
      '@type': 'Person',
      'name': article.author || 'Tech Current Team',
    }],
    'publisher': {
      '@type': 'Organization',
      'name': 'Tech Current',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://techcurrent.com/logo.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : '',
    },
  } : null;

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 max-w-4xl">
      {/* Dynamic SEO Meta Tags & Schema.org Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
          {article.category || 'General'}
        </span>
        {article.is_pinned && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold text-background">
            ★ Editor's Pick
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold mb-4">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border">
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

      {/* Audio Story Reader Section */}
      <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-card border border-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-xs sm:text-sm">Audio Story</h4>
            <p className="text-xs text-muted-foreground">Listen to AI text-to-speech audio narration</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {!isPlayingAudio ? (
            <Button size="sm" onClick={handleAudioPlay} className="flex items-center gap-1.5 rounded-full text-xs sm:text-sm">
              <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {isPausedAudio ? 'Resume' : 'Listen'}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleAudioPause} className="flex items-center gap-1.5 rounded-full text-xs sm:text-sm">
              <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Pause
            </Button>
          )}

          {(isPlayingAudio || isPausedAudio) && (
            <Button size="sm" variant="ghost" onClick={handleAudioStop} className="h-8 w-8 p-0 rounded-full">
              <Square className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}

          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="text-xs bg-muted border border-border rounded-lg px-2 py-1 text-foreground"
          >
            <option value="0.8">0.8x</option>
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>

      {article.image_url && (
        <div className="relative mb-6 sm:mb-8 rounded-2xl overflow-hidden aspect-[16/9]">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-li:text-muted-foreground"
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
        <BookmarkButton articleId={article.id || article.url || ''} />
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}