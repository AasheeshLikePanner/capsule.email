'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ src, alt, width = 100, height = 40, className }: LogoProps) => (
  <div className={cn(
    "flex items-center justify-center rounded-lg p-4",
    "bg-card border border-border shadow-sm",
    className
  )}>
    <Image src={src} alt={alt} width={width} height={height} className="object-contain" />
  </div>
);

interface LogoGridProps {
  logos: Array<{ src: string; alt: string; width?: number; height?: number; className?: string; }>;
}

export const LogoGrid = ({ logos }: LogoGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {logos.map((logo, index) => (
        <Logo key={index} {...logo} />
      ))}
    </div>
  );
};
