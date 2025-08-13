'use server';

import { createClient } from '@/lib/supabase/server';
import { createEmailTemplate as createEmailTemplateGroq } from '@/lib/groq';
import { createEmailTemplate as createEmailTemplateOpenRouter } from '@/lib/openrouter';

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

  // Fetch user's plan and chat counts
  const { data: userProfile, error: userProfileError } = await supabase
    .from('users')
    .select('plan, monthly_chat_count, last_chat_month_reset_date')
    .eq('id', user.id)
    .single();

  if (userProfileError || !userProfile) {
    console.error('[Supabase fetch user profile error]', userProfileError);
    throw new Error('Failed to fetch user profile for chat limit check.');
  }

  let { plan, monthly_chat_count, last_chat_month_reset_date } = userProfile;

  // Monthly reset logic
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let resetRequired = false;
  if (last_chat_month_reset_date) {
    const lastResetDate = new Date(last_chat_month_reset_date);
    if (lastResetDate.getMonth() !== currentMonth || lastResetDate.getFullYear() !== currentYear) {
      resetRequired = true;
    }
  } else {
    // If last_chat_month_reset_date is null, it's a new user or first chat, so reset is needed.
    resetRequired = true;
  }

  if (resetRequired) {
    monthly_chat_count = 0;
    last_chat_month_reset_date = now.toISOString(); // Set to current date
  }

  // Calculate next reset date for error message
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthFormatted = nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Define limits
  const FREE_CHAT_LIMIT = 10;
  const PRO_CHAT_LIMIT = 300;

  // Enforce limits
  if (plan === 'free' && monthly_chat_count >= FREE_CHAT_LIMIT) {
    throw new Error(`You have reached your monthly chat limit of ${FREE_CHAT_LIMIT} messages. Upgrade to Pro for more! Your limit will reset on ${nextMonthFormatted}.`);
  } else if (plan === 'pro' && monthly_chat_count >= PRO_CHAT_LIMIT) {
    throw new Error(`You have reached your monthly chat limit of ${PRO_CHAT_LIMIT} messages. Your limit will reset on ${nextMonthFormatted}.`);
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

    let response: any;
    // if (plan === 'pro') {
      // response = await createEmailTemplateOpenRouter(prompt, brandKit, context);
    // } else {
      response = await createEmailTemplateGroq(prompt, brandKit, context);
    // }

    // Increment monthly_chat_count and update last_chat_month_reset_date
    const { error: updateCountError } = await supabase
      .from('users')
      .update({
        monthly_chat_count: monthly_chat_count + 1,
        last_chat_month_reset_date: last_chat_month_reset_date // Use the potentially reset date
      })
      .eq('id', user.id);

    if (updateCountError) {
      console.error('[Supabase update monthly_chat_count error]', updateCountError);
      // Log the error but don't prevent the chat from being returned
      // as the AI response was already generated.
    }

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
