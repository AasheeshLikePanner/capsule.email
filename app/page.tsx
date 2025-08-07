import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { Navbar } from '@/components/navbar';
import DotPattern from '@/components/dot-pattern';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <DotPattern opacity={0.2} />
      <div className="relative z-10"> {/* Content layered on top */}
        <Navbar />
        <Hero />
        {/* <Features /> */}
      </div>
    </div>
  );
}
