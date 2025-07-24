import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { emailId: string } }) {
  const { emailId } = params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user's current emails array
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('emails')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
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
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Delete the email from the emails table
  const { error } = await supabase.from('emails').delete().eq('id', emailId);

  if (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Email deleted successfully' }, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: { emailId: string } }) {
  const { emailId } = params;
  const { html_content, name, kit_name } = await request.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('emails')
    .update({ html_content, name, kit_name })
    .eq('id', emailId)
    .select();

  if (error) {
    console.error('Error updating email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Email updated successfully', data }, { status: 200 });
}