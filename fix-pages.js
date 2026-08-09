const fs = require('fs');
const path = require('path');

const baseDir = './app/(public)';

const pages = {
  'news/page.tsx': `'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, X } from 'lucide-react';

const categories = [
  { label: 'All', value: 'general' },
  { label: 'AI', value: 'ai' },
  { label: 'Programming', value: 'programming' },
  { label: 'Cybersecurity', value: 'cybersecurity' },
  { label: 'Startups', value: 'startups' },
];

export default function NewsPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams?.get('category') || 'general');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const data = await fetchArticles({ category, limit: 30 });
        setArticles(data || []);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [category]);

  const filtered = articles.filter((a) =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-heading font-bold">News</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-48 md:w-64"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat.value)}
            className="rounded-full"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <ArticleGrid articles={filtered} loading={loading} />
    </div>
  );
}`,

  'ai/page.tsx': `'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';

export default function AIPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchArticles({ category: 'ai', limit: 30 });
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Artificial Intelligence</h1>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}`,

  'programming/page.tsx': `'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';

export default function ProgrammingPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchArticles({ category: 'programming', limit: 30 });
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Programming</h1>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}`,

  'cybersecurity/page.tsx': `'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';

export default function CybersecurityPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchArticles({ category: 'cybersecurity', limit: 30 });
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Cybersecurity</h1>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}`,

  'startups/page.tsx': `'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';

export default function StartupsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchArticles({ category: 'startups', limit: 30 });
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Startups</h1>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}`,

  'reviews/page.tsx': `export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-heading font-bold">Reviews</h1>
      <p className="text-muted-foreground mt-4">Coming soon...</p>
    </div>
  );
}`,

  'tutorials/page.tsx': `export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-heading font-bold">Tutorials</h1>
      <p className="text-muted-foreground mt-4">Coming soon...</p>
    </div>
  );
}`,

  'about/page.tsx': `export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-heading font-bold mb-6">About Tech Current</h1>
      <p className="text-lg text-muted-foreground mb-4">
        We are a technology intelligence platform dedicated to keeping students, developers,
        founders, and enthusiasts ahead of the curve.
      </p>
      <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Our Mission</h2>
      <p className="text-muted-foreground">
        To make technology knowledge accessible, engaging, and actionable.
      </p>
      <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Our Vision</h2>
      <p className="text-muted-foreground">
        To become Africa's most trusted technology media platform.
      </p>
    </div>
  );
}`,

  'contact/page.tsx': `'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <h1 className="text-4xl font-heading font-bold mb-6">Contact Us</h1>
      <p className="text-muted-foreground mb-8">
        We'd love to hear from you. Reach out via email or social media.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Textarea
          rows={5}
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}`,

  'search/page.tsx': `'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArticleGrid } from '@/components/ui/ArticleGrid';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(\`/api/search?q=\${encodeURIComponent(query)}\`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((error) => console.error('Search failed:', error))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-heading font-bold mb-4">
        Search results for "{query}"
      </h1>
      <ArticleGrid articles={results} loading={loading} />
    </div>
  );
}`,

  'profile/page.tsx': `'use client';
import { useSupabase } from '@/hooks/useSupabase';

export default function ProfilePage() {
  const { user } = useSupabase();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-heading font-bold">Profile</h1>
      <p className="text-muted-foreground mt-4">
        {user ? \`Welcome, \${user.email}\` : 'Please log in to view your profile.'}
      </p>
    </div>
  );
}`,

  'bookmarks/page.tsx': `export default function BookmarksPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-heading font-bold">Bookmarks</h1>
      <p className="text-muted-foreground">Your saved articles will appear here.</p>
    </div>
  );
}`,

  'newsletter/page.tsx': `export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-heading font-bold">Newsletter</h1>
      <p className="text-muted-foreground">Subscribe to get the latest tech news.</p>
    </div>
  );
}`
};

// Create each file
Object.entries(pages).forEach(([filePath, content]) => {
  const fullPath = path.join(baseDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Created: ${fullPath}`);
});

console.log('\n✅ All pages have been created/updated!');
console.log('Now restart your dev server: npm run dev');