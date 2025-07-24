import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: emails, error } = await supabase
    .from('emails')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(emails);
}

export async function POST(request: Request) {
  const { html_content, name, kit_name } = await request.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('emails')
    .insert([
      { user_id: user.id, name, html_content, kit_name }
    ])
    .select();

  if (error) {
    console.error("Error saving email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
      return NextResponse.json({ message: 'Email saved successfully, but failed to update user profile', data }, { status: 200 });
    }

    const currentSavedEmails = userProfile?.emails || [];
    const updatedSavedEmails = [...currentSavedEmails, newEmailId];

    // Update user metadata
    const { error: updateError } = await supabase.from('users')
      .update({ emails: updatedSavedEmails })
      .eq('id', user.id);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return NextResponse.json({ message: 'Email saved successfully, but failed to update user profile', data }, { status: 200 });
    }

    return NextResponse.json({ message: 'Email saved successfully', data }, { status: 200 });
  }
}
