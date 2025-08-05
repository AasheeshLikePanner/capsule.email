import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <div className="bg-contain bg-center bg-fixed" >
      <Navbar />
      <Hero />
      {/* <Features /> */}
    </div>
  );
}
