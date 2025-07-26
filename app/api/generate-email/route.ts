

import { NextResponse } from 'next/server';
import { createEmailTemplate } from '@/lib/openrouter';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt, brandKit, context, chatId } = body; // Added chatId

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid prompt' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let currentChatId = chatId;

  try {
    // If no chatId is provided, create a new chat session
    if (!currentChatId) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: prompt.substring(0, 50) + '...', // Use first 50 chars of prompt as title
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error("Error creating chat session:", sessionError);
        return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
      }
      currentChatId = sessionData.id;
    }

    // Save user message
    const userMessageContent = {
      emailContent: prompt,
      brandKit: brandKit,
    };

    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: currentChatId,
        user_id: user.id,
        type: 'user',
        content: userMessageContent,
      });

    if (userMessageError) {
      console.error("Error saving user message:", userMessageError);
      // Continue even if user message fails to save, but log it
    }

    const response: any = await createEmailTemplate(prompt, brandKit, context);

    // Save bot message
    const botMessageContent = {
      title: response.title,
      text: response.text,
      description: response.description,
      code: response.code,
    };

    const { error: botMessageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: currentChatId,
        user_id: user.id, // Bot messages are also associated with the user who initiated the chat
        type: 'bot',
        content: botMessageContent,
      });

    if (botMessageError) {
      console.error("Error saving bot message:", botMessageError);
      // Continue even if bot message fails to save, but log it
    }

    return NextResponse.json({ ...response, chatId: currentChatId });

  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
  }
}

