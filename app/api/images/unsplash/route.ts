import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'technology';
  const perPage = parseInt(searchParams.get('per_page') || '10');

  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Unsplash API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Client-ID ${apiKey}`,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unsplash error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}