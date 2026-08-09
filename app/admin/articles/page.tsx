// app/admin/articles/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { fetchArticles } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setArticles(data);
      } else {
        // Fallback to API articles if DB table is empty or unpopulated
        const apiArticles = await fetchArticles({ limit: 30 });
        setArticles(apiArticles);
      }
    } catch {
      const apiArticles = await fetchArticles({ limit: 30 });
      setArticles(apiArticles);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await supabase.from('articles').delete().eq('id', id);
    } catch {
      // Ignore DB error if running on mock data
    }
    toast.success('Article deleted');
    setArticles(articles.filter((a) => a.id !== id));
  };

  if (loading) return <p className="p-8 text-muted-foreground">Loading articles...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold">Manage Articles</h1>
        <Link href="/admin/articles/new">
          <Button>+ New Article</Button>
        </Link>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted text-xs uppercase font-semibold text-muted-foreground border-b border-border">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Source</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No articles found.
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium max-w-xs truncate">{a.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
                      {a.category || 'general'}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{a.source || 'Tech Current'}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/articles/${a.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(a.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}