'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { Article } from '@/types/article';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MyFeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  useEffect(() => {
    async function loadPersonalizedFeed() {
      try {
        const res = await fetch('/api/feed/personalized');
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
          setActiveTopics(data.userPreferences?.topics || []);
        } else {
          setArticles([]);
        }
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadPersonalizedFeed();
  }, []);

  const filteredArticles = selectedTopic === 'all'
    ? articles
    : articles.filter(a => a.category?.toLowerCase().includes(selectedTopic.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-gold" />
            <h1 className="text-4xl font-heading font-bold">For You Feed</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Articles scored and ranked based on your reading history and preferences
          </p>
        </div>
      </div>

      {/* Topics / Preferences Filter Bar */}
      {activeTopics.length > 0 && (
        <div className="mb-8 p-4 bg-card border border-border rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Scored for:
            </span>
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedTopic === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All Topics
            </button>
            {activeTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all uppercase ${
                  selectedTopic === topic ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            Personalization Engine Active
          </span>
        </div>
      )}

      <ArticleGrid articles={filteredArticles} loading={loading} />
    </div>
  );
}