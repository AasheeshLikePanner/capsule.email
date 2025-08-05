import Link from "next/link";
import { Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Logo = () => (
  <Link href="/" className="flex flex-col items-center">
    <Image src="/icon.svg" alt="Logo" width={40} height={40} />
    <span className="text-xs text-muted-foreground -mt-1">pre-beta</span>
  </Link>
);

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <nav>
        <div className="container mx-auto w-1/2 border-l border-r px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="https://github.com/AasheeshLikePanner/mail" target="_blank" className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" /> 
                  <span className="font-semibold">0</span>
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
