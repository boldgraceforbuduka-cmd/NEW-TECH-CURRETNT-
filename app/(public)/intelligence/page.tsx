'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { TrendingUp, Zap, Users, AlertTriangle } from 'lucide-react';

export default function IntelligencePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticles({ category: 'intelligence', limit: 30 });
        setArticles(data);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-heading font-bold">Tech Current Intelligence</h1>
      </div>
      <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
        What happened. Why it matters. Who is affected. What&apos;s next.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Zap, label: 'What happened?', color: 'text-blue-400' },
          { icon: Users, label: 'Who is affected?', color: 'text-green-400' },
          { icon: TrendingUp, label: 'Why it matters?', color: 'text-gold' },
          { icon: AlertTriangle, label: 'What\'s next?', color: 'text-red-400' },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}