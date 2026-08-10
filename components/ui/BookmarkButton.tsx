'use client';
import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BookmarkButtonProps {
  articleId: string;
  className?: string;
}

export function BookmarkButton({ articleId, className = '' }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const checkBookmark = async () => {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('article_id')
          .eq('user_id', user.id)
          .eq('article_id', articleId);
        if (error) throw error;
        setIsBookmarked((data ?? []).length > 0); // ✅ safe boolean
      } catch (error) {
        console.error('Failed to check bookmark:', error);
        setIsBookmarked(false);
      } finally {
        setLoading(false);
      }
    };
    checkBookmark();
  }, [user, articleId]);

  const toggle = async () => {
    if (!user) {
      toast.error('Please log in to bookmark articles.');
      return;
    }
    setLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);
        if (error) throw error;
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, article_id: articleId });
        if (error) throw error;
        setIsBookmarked(true);
        toast.success('Bookmarked!');
      }
    } catch (error: any) {
      console.error('Bookmark toggle error:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggle}
      disabled={loading}
      className={`text-muted-foreground hover:text-primary transition-colors ${className}`}
    >
      <Bookmark
        className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
      />
    </motion.button>
  );
}