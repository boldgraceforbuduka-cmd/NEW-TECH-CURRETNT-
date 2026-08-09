import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') || 'technology';
  const limit = parseInt(searchParams.get('limit') || '10');

  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Guardian API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://content.guardianapis.com/${section}?api-key=${apiKey}&page-size=${limit}&show-fields=all`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Guardian error:', error);
    return NextResponse.json({ error: 'Failed to fetch Guardian news' }, { status: 500 });
  }
}