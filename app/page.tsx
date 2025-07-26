import dynamic from 'next/dynamic';

const DynamicHero = dynamic(() => import('@/components/hero'));

export default function Home() {
  return (
    <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
      <DynamicHero />
    </div>
  );
}
