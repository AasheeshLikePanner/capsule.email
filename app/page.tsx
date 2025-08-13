import { Hero } from '@/components/hero';
import { Navbar } from '@/components/navbar';
import DotPattern from '@/components/dot-pattern';
import { getRepoStars } from '../lib/github'; // Added import

export default async function Home() { // Made Home component async
  const stars = await getRepoStars('AasheeshLikePanner', 'capsule.email'); // Fetch stars directly

  return (
    <div className="relative w-full">
      <DotPattern opacity={0.2} />
      <div className="relative z-10"> {/* Content layered on top */}
        <Navbar stars={stars} /> {/* Pass stars prop to Navbar */}
        <Hero />
      </div>
    </div>
  );
}
