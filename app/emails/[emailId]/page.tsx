import { createClient } from '@/lib/supabase/server';
import { EmailRenderer } from '@/components/email-render';
import { notFound } from 'next/navigation';

interface EmailPageProps {
  params: {
    emailId: string;
  };
}

export default async function EmailPage({ params }: EmailPageProps) {
  const supabase = createClient();
  const { emailId } = params;

  const { data: email, error } = await supabase
    .from('emails')
    .select('html_content')
    .eq('id', emailId)
    .single();

  if (error || !email) {
    notFound();
  }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-muted/30">
      <div classNameName="w-full h-full max-w-2xl max-h-[90vh] bg-white shadow-lg rounded-lg overflow-hidden">
        <EmailRenderer jsxString={email.html_content} />
      </div>
    </div>
  );
}
