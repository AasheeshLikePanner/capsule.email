import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import UpgradeClientPage from './upgrade-client-page';

export default async function UpgradePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let userEmail: string | any = null;
  if (user) {
    userEmail = user.email;
  }

  return <UpgradeClientPage userEmail={userEmail} />;
}
