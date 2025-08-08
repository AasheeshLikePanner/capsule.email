import { Hero } from '@/components/hero';
import { Navbar } from '@/components/navbar';
import DotPattern from '@/components/dot-pattern';

export default function Home() {
  return (
    <div className="relative w-full">
      <DotPattern opacity={0.2} />
      <div className="relative z-10"> {/* Content layered on top */}
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}
