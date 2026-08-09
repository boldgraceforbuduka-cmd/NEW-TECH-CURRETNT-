'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { Database, Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function DirectoryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticles({ category: 'directory', limit: 100 });
        setArticles(data);
        setFiltered(data);
      } catch {
        setArticles([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      setFiltered(articles);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(articles.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.category?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q)
    ));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-4">
        <Database className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-heading font-bold">Tech Directory</h1>
      </div>
      <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
        Companies, startups, AI tools, products, developers, and investors.
      </p>
      <div className="flex gap-3 mb-8 max-w-md">
        <Input placeholder="Search directory..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={handleSearch}><SearchIcon className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((article) => (
          <div key={article.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <h3 className="font-heading font-semibold">{article.title}</h3>
            <p className="text-sm text-muted-foreground">{article.category}</p>
            <p className="text-xs text-muted-foreground mt-1">{article.source}</p>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">No entries found.</p>
        )}
      </div>
    </div>
  );
}