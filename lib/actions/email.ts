'use server';

import { createClient } from '@/lib/supabase/server';

export async function getEmails() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: emails, error } = await supabase
    .from('emails')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching emails:", error);
    throw new Error(error.message);
  }

  return emails;
}

export async function createEmail(html_content: string, name: string, kit_name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('emails')
    .insert([
      { user_id: user.id, name, html_content, kit_name }
    ])
    .select();

  if (error) {
    console.error("Error saving email:", error);
    throw new Error(error.message);
  } else {
    const newEmailId = data[0].id;

    // Get current user metadata
    const { data: userProfile, error: profileError } = await supabase
      .from('users') // Assuming you have a 'profiles' table linked to auth.users
      .select('emails')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      // Still return success for email save, but log the profile update error
      return { message: 'Email saved successfully, but failed to update user profile', data };
    }

    const currentSavedEmails = userProfile?.emails || [];
    const updatedSavedEmails = [...currentSavedEmails, newEmailId];

    // Update user metadata
    const { error: updateError } = await supabase.from('users')
      .update({ emails: updatedSavedEmails })
      .eq('id', user.id);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return { message: 'Email saved successfully, but failed to update user profile', data };
    }

    return { message: 'Email saved successfully', data };
  }
}

export async function deleteEmail(emailId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch the user's current emails array
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('emails')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw new Error(profileError.message);
  }

  let userEmails = profileData?.emails || [];

  // Filter out the deleted emailId
  userEmails = userEmails.filter((id: string) => id !== emailId);

  // Update the user's profile with the new emails array
  const { error: updateError } = await supabase
    .from('users')
    .update({ emails: userEmails })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating user profile:', updateError);
    throw new Error(updateError.message);
  }

  // Delete the email from the emails table
  const { error } = await supabase.from('emails').delete().eq('id', emailId);

  if (error) {
    console.error('Error deleting email:', error);
    throw new Error(error.message);
  }

  return { message: 'Email deleted successfully' };
}

export async function updateEmail(emailId: string, html_content: string, name: string, kit_name: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('emails')
    .update({ html_content, name, kit_name })
    .eq('id', emailId)
    .select();

  if (error) {
    console.error('Error updating email:', error);
    throw new Error(error.message);
  }

  return { message: 'Email updated successfully', data };
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!to || !subject || !html) {
      throw new Error('Missing required fields: to, subject, html');
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Fetch user's plan and email counts
    const { data: userProfile, error: userProfileError } = await supabase
      .from('users')
      .select('plan, email_sent_today, last_email_sent_date')
      .eq('id', user.id)
      .single();

    if (userProfileError || !userProfile) {
      console.error('[Supabase fetch user profile error]', userProfileError);
      throw new Error('Failed to fetch user profile for email limit check.');
    }

    let { plan, email_sent_today, last_email_sent_date } = userProfile;

    // Daily reset logic
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    let resetRequired = false;
    if (last_email_sent_date) {
      if (last_email_sent_date !== today) {
        resetRequired = true;
      }
    } else {
      // If last_email_sent_date is null, it's a new user or first email, so reset is needed.
      resetRequired = true;
    }

    if (resetRequired) {
      email_sent_today = 0;
      last_email_sent_date = today;
    }

    // Define limits
    const FREE_EMAIL_LIMIT = 5;
    const PRO_EMAIL_LIMIT = 40;

    // Enforce limits
    if (plan === 'free' && email_sent_today >= FREE_EMAIL_LIMIT) {
      throw new Error(`You have reached your daily email limit of ${FREE_EMAIL_LIMIT} messages. Upgrade to Pro for more! Your limit will reset tomorrow.`);
    } else if (plan === 'pro' && email_sent_today >= PRO_EMAIL_LIMIT) {
      throw new Error(`You have reached your daily email limit of ${PRO_EMAIL_LIMIT} messages. Your limit will reset tomorrow.`);
    }

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified sender email
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error.message);
    }

    // Increment email_sent_today and update last_email_sent_date
    const { error: updateCountError } = await supabase
      .from('users')
      .update({
        email_sent_today: email_sent_today + 1,
        last_email_sent_date: last_email_sent_date // Use the potentially reset date
      })
      .eq('id', user.id);

    if (updateCountError) {
      console.error('[Supabase update email_sent_today error]', updateCountError);
      // Log the error but don't prevent the email from being sent
      // as the email was already sent.
    }

    return { message: 'Email sent successfully', data };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    throw new Error(error.message);
  }
}
