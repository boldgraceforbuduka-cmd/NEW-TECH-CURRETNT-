// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json([]);
  }

  const supabase = createClient();

  // Search using Supabase full-text search
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .textSearch('fts', query, { config: 'english' })
    .order('published_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data || []);
}