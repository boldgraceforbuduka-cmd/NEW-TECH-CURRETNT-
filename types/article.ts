// types/article.ts
export interface Article {
  id?: string;
  url?: string;
  title: string;
  description?: string;
  summary?: string; // ✅ NEW – TL;DR summary
  content?: string;
  image_url?: string;
  source?: string;
  author?: string;
  published_at?: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
  is_pinned?: boolean;
  is_editor_pick?: boolean;
  likes?: number;
  bookmarks?: number;
  slug?: string;
}