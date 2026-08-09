'use client';
import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function BookmarkButton({ articleId }: { articleId: string }) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    // Check if article is bookmarked
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(bookmarks => {
        setIsBookmarked(bookmarks.includes(articleId));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, articleId]);

  const toggle = async () => {
    if (!user) {
      toast.error('Please log in to bookmark articles.');
      return;
    }
    const action = isBookmarked ? 'remove' : 'add';
    setLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, action }),
      });
      if (res.ok) {
        setIsBookmarked(!isBookmarked);
        toast.success(action === 'add' ? 'Bookmarked!' : 'Removed from bookmarks.');
      } else {
        toast.error('Failed to update bookmark.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
    </button>
  );
}