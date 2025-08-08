import Link from "next/link";
import { Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import DotPattern from "@/components/dot-pattern";

const Logo = () => (
  <Link href="/" className="flex flex-col items-center">
    <Image src="/icon.svg" alt="Logo" width={40} height={40} />
    <Badge className="text-[0.6rem] -mt-1">pre-beta</Badge>
  </Link>
);

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/90 backdrop-blur-md shadow-lg overflow-hidden">
      {/* Left Dot Pattern */}
      <div className="absolute left-0 top-0 h-full w-[25%] z-[-1]">
        <DotPattern opacity={0.05} />
      </div>
      {/* Right Dot Pattern */}
      <div className="absolute right-0 top-0 h-full w-[25%] z-[-1]">
        <DotPattern opacity={0.05} />
      </div>
      <nav>
        <div className="container mx-auto w-1/2 border-l border-r px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-light-black-foreground hover:bg-muted/20 transition-colors px-3 py-2 rounded-md">
                Pricing
              </Link>
              <Button asChild variant="outline" size="default">
                <Link href="https://github.com/AasheeshLikePanner/mail" target="_blank" className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" /> 
                  <span className="font-semibold">0</span>
                </Link>
              </Button>
              <Button asChild size="default" className="font-semibold">
                <Link href="/auth/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
