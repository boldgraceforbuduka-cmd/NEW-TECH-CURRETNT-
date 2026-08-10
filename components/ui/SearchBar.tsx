// components/ui/SearchBar.tsx (Simplified)
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const titles = data.map((a: any) => a.title).slice(0, 5);
      setSuggestions(titles);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-10 w-full"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {suggestions.map((title) => (
            <button
              key={title}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => {
                setQuery(title);
                router.push(`/search?q=${encodeURIComponent(title)}`);
              }}
            >
              {title}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}