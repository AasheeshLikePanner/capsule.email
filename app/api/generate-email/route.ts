
import { NextResponse } from 'next/server';
import { createEmailTemplate } from '@/lib/gemini';

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid prompt' }, { status: 400 });
  }

  try {
    const stream = await createEmailTemplate(prompt);
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
  }
}
