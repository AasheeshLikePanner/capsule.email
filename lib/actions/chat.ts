'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createEmailTemplate } from '@/lib/openrouter';

export async function getChatSessions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data: chatSessions, error } = await supabase
      .from('chat_sessions')
      .select('id, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching chat sessions:", error);
      throw new Error(error.message);
    }

    return chatSessions;
  } catch (err: any) {
    console.error('[API Error]', err);
    throw new Error('Failed to fetch chat sessions');
  }
}

export async function generateEmailAndCreateChat(prompt: string, brandKit: any, context: string, chatId: string) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Missing or invalid prompt');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
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
        throw new Error('Failed to create chat session');
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

    return { ...response, chatId: currentChatId };

  } catch (err) {
    console.error('[API Error]', err);
    throw new Error('Failed to generate email');
  }
}

export async function updateChatVisibility(chatId: string, isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('user_id')
      .eq('id', chatId)
      .single();

    if (sessionError) {
      console.error("Error fetching chat session:", sessionError);
      throw new Error('Chat not found');
    }

    if (user.id !== chatSession.user_id) {
      throw new Error('Forbidden');
    }

    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ ispublic: isPublic })
      .eq('id', chatId);

    if (updateError) {
      console.error("Error updating chat session:", updateError);
      throw new Error(updateError.message);
    }

    return { message: 'Chat session updated successfully' };
  } catch (err: any) {
    console.error('[API Error]', err);
    throw new Error('Failed to update chat session');
  }
}

export async function getChatMessages(chatId: string) {
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
      throw new Error('Chat not found');
    }

    const isOwner = user && user.id === chatSession.user_id;

    // If the chat is not public and the user is not the owner, deny access
    if (!chatSession.ispublic && !isOwner) {
      throw new Error('Unauthorized');
    }

    // If authorized, fetch the messages for the chat
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', chatId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error("Error fetching chat messages:", messagesError);
      throw new Error(messagesError.message);
    }

    // Return messages along with ownership and public status
    return { messages, isOwner, isPublic: chatSession.ispublic };

  } catch (err: any) {
    console.error('[API Error]', err);
    throw new Error('Failed to fetch chat messages');
  }
}
