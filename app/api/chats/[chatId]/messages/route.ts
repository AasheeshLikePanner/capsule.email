import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  const chatId = params.chatId;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', chatId)
      .eq('user_id', user.id) // Ensure messages belong to the authenticated user
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(messages);
  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to fetch chat messages' }, { status: 500 });
  }
}
