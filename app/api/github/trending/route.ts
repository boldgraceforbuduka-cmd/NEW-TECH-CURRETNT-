import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || '';
  const since = searchParams.get('since') || 'daily';

  try {
    const url = `https://github-trending-api.vercel.app/repos?${language ? `language=${language}&` : ''}since=${since}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub trending error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub trending' }, { status: 500 });
  }
}