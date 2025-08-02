import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  const chatId = params.chatId;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    // First, get the chat session to check its visibility and ownership
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('user_id, ispublic')
      .eq('id', chatId)
      .single();

    if (sessionError) {
      console.error("Error fetching chat session:", sessionError);
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const isOwner = user && user.id === chatSession.user_id;

    // If the chat is not public and the user is not the owner, deny access
    if (!chatSession.ispublic && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If authorized, fetch the messages for the chat
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', chatId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error("Error fetching chat messages:", messagesError);
      return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    // Return messages along with ownership and public status
    return NextResponse.json({ messages, isOwner, isPublic: chatSession.ispublic });

  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to fetch chat messages' }, { status: 500 });
  }
}
