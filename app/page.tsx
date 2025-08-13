import { Hero } from '@/components/hero';
import { Navbar } from '@/components/navbar';
// import DotPattern from '@/components/dot-pattern'; // Removed import
import Features from '@/components/features';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';
import { getRepoStars } from '../lib/github';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function Home() {
  const stars = await getRepoStars('AasheeshLikePanner', 'capsule.email');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userEmail: string | null = null;
 

  return (
    <div className="relative w-full">
      {/* <DotPattern opacity={0.2} /> */} {/* Removed DotPattern here */}
      <div className="relative z-10"> {/* Content layered on top */}
        <Navbar stars={stars} />
        <Hero />
        <div className="mt-40 px-40"> {/* Added div for vertical padding */}
          <Features />
        </div>
        <Pricing userEmail={userEmail} />
        <Footer />
      </div>
    </div>
  );
}
