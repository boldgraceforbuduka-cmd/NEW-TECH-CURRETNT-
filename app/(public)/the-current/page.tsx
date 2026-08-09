'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { Calendar, TrendingUp, Zap, Star } from 'lucide-react';

export default function TheCurrentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticles({ category: 'the-current', limit: 30 });
        setArticles(data);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-heading font-bold">The Current</h1>
      </div>
      <p className="text-muted-foreground text-lg mb-2">Your daily tech briefing</p>
      <p className="text-sm text-muted-foreground mb-8">— {today}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-gold" />
            <span className="font-semibold">5 things happening in tech</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• OpenAI launches GPT-5</li>
            <li>• Apple announces Vision Pro 2</li>
            <li>• African fintech raises $50M</li>
            <li>• New zero-day vulnerability</li>
            <li>• Quantum computing breakthrough</li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">3 things you should know</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• AI regulation updates</li>
            <li>• Cloud pricing changes</li>
            <li>• New developer tools</li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-gold" />
            <span className="font-semibold">1 thing to watch</span>
          </div>
          <p className="text-sm text-muted-foreground">The rise of AI agents in enterprise software.</p>
        </div>
      </div>
      <h2 className="text-2xl font-heading font-bold mb-4">Top Stories</h2>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}