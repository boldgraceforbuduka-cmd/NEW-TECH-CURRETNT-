import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'topstories';
  const limit = parseInt(searchParams.get('limit') || '30');

  try {
    // Get story IDs
    const idsRes = await fetch(`https://hacker-news.firebaseio.com/v0/${type}.json`);
    const ids = await idsRes.json();
    const topIds = ids.slice(0, limit);

    // Fetch each story
    const stories = await Promise.all(
      topIds.map(async (id: number) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return res.json();
      })
    );

    return NextResponse.json(stories.filter(s => s !== null));
  } catch (error) {
    console.error('Hacker News error:', error);
    return NextResponse.json({ error: 'Failed to fetch Hacker News' }, { status: 500 });
  }
}