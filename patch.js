const fs = require('fs');
const path = require('path');

const root = process.cwd();

function write(file, content) {
  const full = path.join(root, file);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log(`✅ Updated: ${file}`);
}

// ============================================================
// 1. API route – 5000+ articles with images
// ============================================================
write('app/api/news/route.ts', `import { NextResponse } from 'next/server';

export const revalidate = 60;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateArticle(index) {
  const categories = ['ai', 'programming', 'cybersecurity', 'startups', 'general'];
  const category = categories[rand(0, categories.length - 1)];
  const titles = [
    'AI Breakthrough: New Model Achieves Human-Level Reasoning',
    'Next.js 15: The Future of Web Development',
    'Critical Zero-Day Vulnerability Patched',
    'African Fintech Startup Raises $50M Series B',
    'Rust vs Go: Which Language Should You Learn in 2026?',
    'OpenAI Announces GPT-5 with Advanced Reasoning',
    'Google Unveils Quantum Computing Breakthrough',
    'Meta’s New AI Model Beats Human Benchmarks',
    'Apple’s Vision Pro 2: A New Era of Spatial Computing',
    'Microsoft’s Copilot AI Now Integrates with Everything',
    'Amazon’s Drone Delivery Goes Mainstream',
    'Tesla’s Full Self-Driving Finally Approved',
    'The Rise of WebAssembly in 2026',
    'React 19: What Developers Need to Know',
    'The Future of Cryptocurrency Regulation',
    'How to Build a Scalable Microservices Architecture',
    'The State of Cloud Computing in 2026',
    'The Impact of 5G on IoT',
    'Cybersecurity Trends to Watch',
    'How Startups Are Leveraging AI for Growth',
  ];
  const title = titles[rand(0, titles.length - 1)] + \` (\${index})\`;
  const desc = 'A groundbreaking development in technology that could change everything.';
  const content = \`<p>\${desc}</p><p>\${desc}</p><p>\${desc}</p>\`.repeat(3);
  return {
    id: String(index),
    url: \`https://techcurrent.com/article-\${index}\`,
    title,
    description: desc,
    content,
    image_url: \`https://picsum.photos/seed/\${index}/800/400\`,
    source: 'Tech Current',
    author: ['Buduka Oyagiri', 'AI Research Team', 'Dev Team', 'Security Team', 'Startup Editor'][rand(0, 4)],
    published_at: new Date(Date.now() - rand(0, 30) * 3600000).toISOString(),
    category,
    tags: ['tech', 'innovation', category],
    reading_time: rand(2, 8),
    is_pinned: index < 5,
    likes: rand(10, 500),
    bookmarks: rand(5, 200),
  };
}

function generateArticles(count = 5000) {
  const articles = [];
  for (let i = 0; i < count; i++) articles.push(generateArticle(i + 1));
  return articles;
}

let cachedArticles = null;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  if (!cachedArticles) cachedArticles = generateArticles(5000);

  let articles = cachedArticles;
  if (category && category !== 'general') {
    articles = articles.filter(a => a.category === category);
  }
  articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  const start = (page - 1) * limit;
  const paginated = articles.slice(start, start + limit);

  return NextResponse.json({
    articles: paginated,
    total: articles.length,
    page,
    limit,
    totalPages: Math.ceil(articles.length / limit),
  });
}`);

// ============================================================
// 2. About page – founder info
// ============================================================
write('app/(public)/about/page.tsx', `export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-heading font-bold mb-6">About Tech Current</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Tech Current is a modern technology intelligence and media platform
        dedicated to making technology easier to understand and harder to ignore.
      </p>
      <p className="text-lg text-muted-foreground mb-8">
        We bring together the latest developments in{' '}
        <strong>AI, software, startups, cybersecurity, gadgets, and the digital world</strong>—
        helping students, developers, founders, and technology enthusiasts stay informed.
      </p>

      <h2 className="text-2xl font-heading font-bold mt-8 mb-4">About the Founder</h2>
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">BO</div>
          <div>
            <h3 className="text-xl font-heading font-semibold">Buduka Oyagiri</h3>
            <p className="text-sm text-muted-foreground">Founder, Tech Current</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          <strong>Buduka Oyagiri</strong> is a Computer Science student, technology enthusiast,
          and aspiring builder passionate about the intersection of technology, innovation, business, and human impact.
        </p>
        <p className="text-muted-foreground mt-3">
          As the founder of <strong>Tech Current</strong>, Buduka created the platform to make
          technology easier to understand and harder to ignore—bringing together the ideas, products,
          breakthroughs, and people shaping the future of technology.
        </p>
        <p className="text-muted-foreground mt-3">
          He believes technology is not simply something to consume; it is something to{' '}
          <strong>understand, build with, and use to create meaningful change</strong>.
        </p>
        <p className="text-muted-foreground mt-3 italic">
          Tech Current is part of that journey: helping people stay informed, curious, and ready for what comes next.
        </p>
      </div>

      <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Our Mission</h2>
      <p className="text-muted-foreground mb-8">
        To make technology knowledge accessible, engaging, and actionable—
        transforming complex developments into information people can understand, explore, and use.
      </p>

      <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Our Vision</h2>
      <p className="text-muted-foreground">
        To become Africa&apos;s most trusted technology media and intelligence platform,
        connecting people with the knowledge and ideas shaping tomorrow.
      </p>
    </div>
  );
}`);

// ============================================================
// 3. Client fetch – handle paginated response
// ============================================================
write('lib/api/client.ts', `import { Article } from '@/types/article';

export async function fetchArticles(params = {}) {
  const { category = 'general', limit = 20, sort = 'latest', pinned = false, page = 1 } = params;

  let baseUrl = '';
  if (typeof window !== 'undefined') baseUrl = window.location.origin;
  else baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const url = new URL('/api/news', baseUrl);
  if (category) url.searchParams.set('category', category);
  if (limit) url.searchParams.set('limit', String(limit));
  if (sort) url.searchParams.set('sort', sort);
  if (pinned) url.searchParams.set('pinned', 'true');
  if (page) url.searchParams.set('page', String(page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch articles');
  const data = await res.json();
  return data.articles || [];
}

export async function fetchArticleBySlug(slug) {
  const all = await fetchArticles({ limit: 10000 });
  return all.find(a => (a.slug || encodeURIComponent(a.url || '')) === slug);
}`);

// ============================================================
// 4. Newsletter signup – make subscribe button work
// ============================================================
write('components/sections/NewsletterSignup.tsx', `'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-gold/10 border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
            <Mail className="h-4 w-4" />
            <span>Stay in the loop</span>
          </div>
          <h3 className="text-3xl font-heading font-bold">Get the weekly newsletter</h3>
          <p className="text-muted-foreground mt-2">
            Subscribe to get the top tech stories, AI breakthroughs, and startup insights every Friday.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1" />
            <Button type="submit" disabled={loading}>{loading ? 'Subscribing...' : 'Subscribe'}</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}`);

// ============================================================
// 5. Explore Stories button – ensure link works
// ============================================================
// This is in Hero.tsx – we'll just ensure the Link is correct.
// If your Hero.tsx already has <Link href="/news">, no change needed.
console.log('\n✅ Patch complete!');
console.log('Restart your dev server: npm run dev');