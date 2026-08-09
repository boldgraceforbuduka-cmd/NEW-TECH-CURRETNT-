import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'technology';
  const perPage = parseInt(searchParams.get('per_page') || '10');

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Pexels API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Pexels error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}