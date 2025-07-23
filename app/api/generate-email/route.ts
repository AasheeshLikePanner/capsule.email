

import { NextResponse } from 'next/server';
import { createEmailTemplate } from '@/lib/openrouter';

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt, brandKit, context } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid prompt' }, { status: 400 });
  }

  try {
    const response:any = await createEmailTemplate(prompt, brandKit, context);
    return NextResponse.json(response);

  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
  }
}

