import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: chatSessions, error } = await supabase
      .from('chat_sessions')
      .select('id, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching chat sessions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(chatSessions);
  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}
