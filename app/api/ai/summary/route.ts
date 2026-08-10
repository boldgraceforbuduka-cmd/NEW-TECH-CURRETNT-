// app/api/ai/summary/route.ts
import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/ai/openrouter';

export async function POST(request: Request) {
  const { title, content } = await request.json();

  if (!content) {
    return NextResponse.json({ error: 'No content provided' }, { status: 400 });
  }

  const plainText = content.replace(/<[^>]*>?/gm, '');
  const truncated = plainText.slice(0, 2000);

  const prompt = `Summarise the following article in 2-3 concise bullet points (max 60 words total). Return as plain text with bullet points (use "- " at the start of each point).\n\nTitle: ${title}\n\nContent: ${truncated}`;

  try {
    const summary = await callOpenRouter({
      messages: [
        {
          role: 'system',
          content:
            'You are a tech news summariser. Provide 2-3 bullet points that capture the key insights. Be concise and clear.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 150,
    });
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI summary error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}