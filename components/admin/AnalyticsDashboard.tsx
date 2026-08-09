// components/admin/AnalyticsDashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Activity, Users, BookOpen, Heart, Bookmark } from 'lucide-react';

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    users: 0,
    likes: 0,
    bookmarks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [articles, users, likes, bookmarks] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('likes').select('*', { count: 'exact', head: true }),
        supabase.from('bookmarks').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        articles: articles.count || 0,
        users: users.count || 0,
        likes: likes.count || 0,
        bookmarks: bookmarks.count || 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading analytics...</p>;
  }

  const cards = [
    { label: 'Articles', value: stats.articles, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Users', value: stats.users, icon: Users, color: 'text-green-400' },
    { label: 'Likes', value: stats.likes, icon: Heart, color: 'text-red-400' },
    { label: 'Bookmarks', value: stats.bookmarks, icon: Bookmark, color: 'text-gold' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-heading font-bold">Analytics Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}