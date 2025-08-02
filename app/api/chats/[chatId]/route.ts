import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: Request, { params }: { params: { chatId: string } }) {
  const chatId = params.chatId;
  const { ispublic } = await request.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('user_id')
      .eq('id', chatId)
      .single();

    if (sessionError) {
      console.error("Error fetching chat session:", sessionError);
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (user.id !== chatSession.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ ispublic })
      .eq('id', chatId);

    if (updateError) {
      console.error("Error updating chat session:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Chat session updated successfully' });
  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to update chat session' }, { status: 500 });
  }
}
