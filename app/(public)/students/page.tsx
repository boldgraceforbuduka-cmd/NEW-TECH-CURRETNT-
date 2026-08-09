'use client';
import { useState, useEffect } from 'react';
import { ArticleGrid } from '@/components/ui/ArticleGrid';
import { fetchArticles } from '@/lib/api/client';
import { Article } from '@/types/article';
import { GraduationCap, Award, Briefcase, Code } from 'lucide-react';

export default function StudentsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticles({ category: 'students', limit: 30 });
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
        <GraduationCap className="h-8 w-8 text-gold" />
        <h1 className="text-4xl font-heading font-bold">Students</h1>
      </div>
      <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
        Scholarships, internships, hackathons, careers, and free courses for the next generation of tech leaders.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Award, label: 'Scholarships', href: '/students/scholarships' },
          { icon: Briefcase, label: 'Internships', href: '/students/internships' },
          { icon: Code, label: 'Hackathons', href: '/students/hackathons' },
          { icon: GraduationCap, label: 'Free Courses', href: '/students/courses' },
        ].map((item) => (
          <a key={item.label} href={item.href} className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors">
            <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">{item.label}</p>
          </a>
        ))}
      </div>
      <ArticleGrid articles={articles} loading={loading} />
    </div>
  );
}