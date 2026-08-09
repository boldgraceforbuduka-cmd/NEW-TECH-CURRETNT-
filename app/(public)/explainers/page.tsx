'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { Lightbulb } from 'lucide-react';

export default function ExplainersPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticles({ category: 'explainers', limit: 30 });
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
        <Lightbulb className="h-8 w-8 text-gold" />
        <h1 className="text-4xl font-heading font-bold">Tech Explainers</h1>
      </div>
      <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
        Simple explanations of complicated technology. No jargon, just clarity.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          'What happens when you send a WhatsApp message?',
          'How does blockchain actually work?',
          'Why is quantum computing different?',
          'What is an API in plain English?'
        ].map((q) => (
          <div key={q} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer">
            <p className="font-medium">{q}</p>
          </div>
        ))}
      </div>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}