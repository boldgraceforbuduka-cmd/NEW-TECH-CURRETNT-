// app/admin/articles/new/page.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function NewArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: 'general',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('articles').insert({
      ...form,
      source: 'Tech Current',
      published_at: new Date().toISOString(),
      tags: form.tags.split(',').map((t) => t.trim()),
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Article published!');
      router.push('/admin/articles');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold mb-6">New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Textarea
          rows={8}
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <select
          className="w-full p-3 bg-muted border border-border rounded-md text-foreground"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="general">General</option>
          <option value="ai">AI</option>
          <option value="programming">Programming</option>
          <option value="cybersecurity">Cybersecurity</option>
          <option value="startups">Startups</option>
        </select>
        <Input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </Button>
      </form>
    </div>
  );
}