import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { brandKitId: string } }) {
  const awaitedParams = await params;
  const { brandKitId } = awaitedParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { data: brandKit, error } = await supabase
    .from('brandkits')
    .select('*')
    .eq('id', brandKitId)
    .single();

  if (error) {
    console.error('[Supabase fetch error]', error);
    return NextResponse.json({ error: 'Failed to fetch brand kit' }, { status: 500 });
  }

  if (!brandKit) {
    return NextResponse.json({ error: 'Brand kit not found' }, { status: 404 });
  }

  return NextResponse.json(brandKit, { status: 200 });
}