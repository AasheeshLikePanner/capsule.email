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

    return { message: 'Email sent successfully', data };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    throw new Error(error.message);
  }
}
