// hooks/useBookmarks.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    const userId = user.id;
    async function loadBookmarks() {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("article_id")
        .eq("user_id", userId);
      if (!error && data) {
        setBookmarks(data.map((b) => b.article_id));
      }
      setLoading(false);
    }
    loadBookmarks();
  }, [user]);

  const toggleBookmark = async (articleId: string) => {
    if (!user) return { error: "Please log in" };
    const isBookmarked = bookmarks.includes(articleId);
    if (isBookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("article_id", articleId);
      setBookmarks(bookmarks.filter((id) => id !== articleId));
    } else {
      await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, article_id: articleId });
      setBookmarks([...bookmarks, articleId]);
    }
    return { success: true };
  };

  return { bookmarks, loading, toggleBookmark };
}
